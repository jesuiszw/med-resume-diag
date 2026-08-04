import axios from 'axios';
import * as cheerio from 'cheerio';
import { ExpectedDirection, DIRECTION_LABELS } from '../types';
import type { JobMarketInfo } from '../types';
import { KEYWORD_DATABASE } from '../data/keywordDatabase';
import { JOB_DATABASE } from '../data/jobDatabase';

const SCRAPE_TIMEOUT = 10000;

interface ScrapedJob {
  title: string;
  company: string;
  salary: string;
  location: string;
}

/**
 * Generate JobMarketInfo from the curated database as fallback.
 */
function generateFromDatabase(direction: ExpectedDirection): JobMarketInfo {
  const directionData = KEYWORD_DATABASE[direction];
  const directionJobs = JOB_DATABASE.filter((job) => job.direction === direction);
  const directionLabel = DIRECTION_LABELS[direction];

  // Aggregate common requirements
  const requirementCounts: Record<string, number> = {};
  for (const job of directionJobs) {
    for (const req of job.requirements) {
      requirementCounts[req] = (requirementCounts[req] || 0) + 1;
    }
  }
  const commonRequirements = Object.entries(requirementCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([req]) => req);

  const keywords = directionData.keywords.slice(0, 8);
  const locations = [...new Set(directionJobs.map((j) => j.location))];

  return {
    trends: `当前${directionLabel}方向岗位需求活跃，主要集中在${locations.join('、')}等城市。市场对该方向的${directionData.requiredSkills.slice(0, 3).join('、')}等核心能力有较高要求。`,
    commonRequirements:
      commonRequirements.length > 0
        ? commonRequirements
        : directionData.requiredSkills.slice(0, 5),
    salaryRange: directionData.salaryRange,
    keywords,
    summary: `${directionLabel}方向当前有${directionJobs.length}个精选岗位，薪资集中在${directionData.salaryRange}。核心能力要求包括${directionData.keywords.slice(0, 5).join('、')}。${directionData.description}`,
  };
}

/**
 * Scrape 医药人才网 (jobuy.com) for job listings.
 */
async function scrapeJobuy(keyword: string): Promise<ScrapedJob[] | null> {
  try {
    const response = await axios.get('https://www.jobuy.com/search.html', {
      params: { keyword },
      timeout: SCRAPE_TIMEOUT,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    });

    const $ = cheerio.load(response.data);
    const jobs: ScrapedJob[] = [];

    $('.job-item, .search-result-item, .list-item, .job-list li').each((_, el) => {
      const title = $(el).find('.job-title, .title, h3, h4, a').first().text().trim();
      const company = $(el).find('.company-name, .company, .c_name').first().text().trim();
      const salary = $(el).find('.salary, .job-salary').first().text().trim();
      const location = $(el).find('.location, .job-area').first().text().trim();
      if (title && title.length > 2) {
        jobs.push({ title, company, salary, location });
      }
    });

    return jobs.length > 0 ? jobs : null;
  } catch {
    return null;
  }
}

/**
 * Scrape 丁香人才 (job.dxy.cn) for job listings.
 */
async function scrapeDxy(keyword: string): Promise<ScrapedJob[] | null> {
  try {
    const response = await axios.get('https://job.dxy.cn/search', {
      params: { keyword },
      timeout: SCRAPE_TIMEOUT,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    });

    const $ = cheerio.load(response.data);
    const jobs: ScrapedJob[] = [];

    $('.job-list-item, .search-item, .recruit-list__item, .list_item').each((_, el) => {
      const title = $(el).find('.job-title, .title, h3, a').first().text().trim();
      const company = $(el).find('.company-name, .company, .recruit-list__company').first().text().trim();
      const salary = $(el).find('.salary, .job-salary').first().text().trim();
      const location = $(el).find('.location, .job-area').first().text().trim();
      if (title && title.length > 2) {
        jobs.push({ title, company, salary, location });
      }
    });

    return jobs.length > 0 ? jobs : null;
  } catch {
    return null;
  }
}

/**
 * Search job market information for a given direction.
 * Attempts to scrape real-time data from medical job websites,
 * falls back to curated database if scraping fails.
 */
export async function searchJobMarket(
  direction: ExpectedDirection
): Promise<JobMarketInfo> {
  const directionLabel = DIRECTION_LABELS[direction];
  const searchKeyword = directionLabel.split('(')[0].trim();

  // Try scraping
  let scrapedJobs: ScrapedJob[] | null = null;

  try {
    scrapedJobs = await scrapeJobuy(searchKeyword);
    if (!scrapedJobs || scrapedJobs.length < 3) {
      scrapedJobs = await scrapeDxy(searchKeyword);
    }
  } catch {
    // Silently fallback to database
  }

  // Fallback to database if scraping failed
  if (!scrapedJobs || scrapedJobs.length < 3) {
    console.log('[WebScrape] Scraping failed or insufficient results, using database fallback');
    return generateFromDatabase(direction);
  }

  // Aggregate scraped data
  const directionData = KEYWORD_DATABASE[direction];
  const directionJobs = JOB_DATABASE.filter((job) => job.direction === direction);

  const salaries = scrapedJobs
    .map((j) => j.salary)
    .filter((s) => s && (s.includes('-') || s.toLowerCase().includes('k')));

  const locations = [...new Set(scrapedJobs.map((j) => j.location).filter((l) => l))];

  // Common requirements from database (scraping doesn't give detailed requirements)
  const requirementCounts: Record<string, number> = {};
  for (const job of directionJobs) {
    for (const req of job.requirements) {
      requirementCounts[req] = (requirementCounts[req] || 0) + 1;
    }
  }
  const commonRequirements = Object.entries(requirementCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([req]) => req);

  return {
    trends: `近期医药行业${searchKeyword}方向岗位需求活跃，互联网招聘平台显示共${scrapedJobs.length}个相关岗位，集中在${locations.slice(0, 3).join('、')}等城市。`,
    commonRequirements:
      commonRequirements.length > 0
        ? commonRequirements
        : directionData.requiredSkills.slice(0, 5),
    salaryRange:
      salaries.length > 0 ? salaries.slice(0, 3).join(' / ') : directionData.salaryRange,
    keywords: directionData.keywords.slice(0, 8),
    summary: `当前${directionLabel}方向在互联网招聘平台有${scrapedJobs.length}个活跃岗位，薪资集中在${salaries.length > 0 ? salaries[0] : directionData.salaryRange}。核心能力要求包括${directionData.keywords.slice(0, 5).join('、')}。${directionData.description}`,
  };
}
