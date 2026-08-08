import axios, { type AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { ExpectedDirection, DIRECTION_LABELS } from '../types';
import type { JobMarketInfo } from '../types';
import { getKeywordSet } from '../data/keywordDatabase';
import { getJobsByDirection } from '../data/jobDatabase';

/**
 * WebScrapeService — Scrapes medical job recruitment websites for real-time
 * job market data using axios + cheerio.
 *
 * Replaces webSearchService.ts + llmService.searchJobMarket.
 *
 * Target sites: 丁香人才 (job.dxy.cn), 医药人才网 (jobuy.com)
 * If scraping fails (anti-crawl / timeout / network), falls back to the
 * curated jobDatabase to generate JobMarketInfo.
 *
 * All requests have a 10-second timeout.
 */

/** Request timeout in milliseconds. */
const REQUEST_TIMEOUT_MS = 10000;

/** Search keywords mapped to each direction for scraping queries. */
const DIRECTION_SEARCH_TERMS: Record<ExpectedDirection, string> = {
  [ExpectedDirection.ProductManager]: '医药产品经理',
  [ExpectedDirection.MSL]: '医学联络官 MSL',
  [ExpectedDirection.SalesSpecialist]: '医药销售代表',
  [ExpectedDirection.MarketingExecutive]: '医药市场推广',
  [ExpectedDirection.MarketAccess]: '市场准入 医保',
  [ExpectedDirection.ClinicalTrial]: '临床监查员 CRA',
  [ExpectedDirection.Pharmacovigilance]: '药物警戒',
  [ExpectedDirection.RegulatoryAffairs]: '药品注册',
  [ExpectedDirection.BusinessDevelopment]: '医药商务拓展 BD',
  [ExpectedDirection.DeviceSales]: '医疗器械销售',
};

/** Scraped job listing entry. */
interface ScrapedJob {
  title: string;
  salary: string;
  company: string;
  location: string;
}

/**
 * Creates a configured axios instance with browser-like headers
 * to reduce the chance of being blocked by anti-crawl systems.
 *
 * @returns Configured axios instance
 */
function createHttpClient(): AxiosInstance {
  return axios.create({
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    },
    maxRedirects: 3,
  });
}

/**
 * Scrapes job listings from 丁香人才 (job.dxy.cn) for the given search term.
 *
 * @param searchTerm - The search keyword
 * @returns Array of scraped job entries
 */
async function scrapeDxyJobs(searchTerm: string): Promise<ScrapedJob[]> {
  const client = createHttpClient();
  const url = `https://job.dxy.cn/search?keyword=${encodeURIComponent(searchTerm)}`;

  console.log(`[WebScrape] Fetching DXY: ${url}`);
  const response = await client.get(url);
  const $ = cheerio.load(response.data);

  const jobs: ScrapedJob[] = [];

  // Parse job listing items — selectors are based on common job board patterns
  // DXY job list typically uses .job-list-item or similar containers
  $('.job-item, .list-item, .search-result-item, .job-card').each((_, el) => {
    const $el = $(el);
    const title =
      $el.find('.job-title, .title, .position, .job-name').first().text().trim() ||
      $el.find('a').first().text().trim();
    const salary =
      $el.find('.salary, .job-salary, .pay').first().text().trim() || '';
    const company =
      $el.find('.company, .company-name, .employer').first().text().trim() || '';
    const location =
      $el.find('.location, .area, .job-area').first().text().trim() || '';

    if (title && title.length > 1) {
      jobs.push({
        title,
        salary: salary || '面议',
        company: company || '未知公司',
        location: location || '未知地点',
      });
    }
  });

  return jobs;
}

/**
 * Scrapes job listings from 医药人才网 (jobuy.com) for the given search term.
 *
 * @param searchTerm - The search keyword
 * @returns Array of scraped job entries
 */
async function scrapeJobuyJobs(searchTerm: string): Promise<ScrapedJob[]> {
  const client = createHttpClient();
  const url = `https://www.jobuy.com/search?keyword=${encodeURIComponent(searchTerm)}`;

  console.log(`[WebScrape] Fetching Jobuy: ${url}`);
  const response = await client.get(url);
  const $ = cheerio.load(response.data);

  const jobs: ScrapedJob[] = [];

  $('.job-item, .list-item, .search-result-item, .job-card, .position-item').each(
    (_, el) => {
      const $el = $(el);
      const title =
        $el.find('.job-title, .title, .position, .job-name').first().text().trim() ||
        $el.find('a').first().text().trim();
      const salary =
        $el.find('.salary, .job-salary, .pay').first().text().trim() || '';
      const company =
        $el.find('.company, .company-name, .employer').first().text().trim() || '';
      const location =
        $el.find('.location, .area, .job-area').first().text().trim() || '';

      if (title && title.length > 1) {
        jobs.push({
          title,
          salary: salary || '面议',
          company: company || '未知公司',
          location: location || '未知地点',
        });
      }
    }
  );

  return jobs;
}

/**
 * Extracts salary statistics from scraped job data.
 * Parses numeric salary values and computes min/max/average.
 *
 * @param jobs - Array of scraped jobs
 * @returns Salary range description string
 */
function analyzeSalaryRange(jobs: ScrapedJob[]): string {
  const salaries: number[] = [];

  for (const job of jobs) {
    // Match patterns like "15K-25K", "15000-25000", "15k-25k/月"
    const kMatch = job.salary.match(/(\d+\.?\d*)\s*[Kk]\s*[-~]\s*(\d+\.?\d*)\s*[Kk]/);
    if (kMatch) {
      const min = parseFloat(kMatch[1]) * 1000;
      const max = parseFloat(kMatch[2]) * 1000;
      salaries.push(min, max);
      continue;
    }

    // Match "15K" single value
    const singleKMatch = job.salary.match(/(\d+\.?\d*)\s*[Kk]/);
    if (singleKMatch) {
      salaries.push(parseFloat(singleKMatch[1]) * 1000);
      continue;
    }

    // Match "15000-25000"
    const numMatch = job.salary.match(/(\d{4,})\s*[-~]\s*(\d{4,})/);
    if (numMatch) {
      salaries.push(parseInt(numMatch[1], 10), parseInt(numMatch[2], 10));
      continue;
    }
  }

  if (salaries.length === 0) {
    return '薪资数据暂未获取到具体数值，多为面议形式。';
  }

  const minSalary = Math.min(...salaries);
  const maxSalary = Math.max(...salaries);
  const avgSalary = Math.round(
    salaries.reduce((sum, s) => sum + s, 0) / salaries.length
  );

  const formatSalary = (val: number): string => {
    if (val >= 10000) {
      return `${(val / 10000).toFixed(1)}万`;
    }
    return `${val}元`;
  };

  return `${formatSalary(minSalary)} - ${formatSalary(maxSalary)}/月（均值约${formatSalary(avgSalary)}/月），基于${salaries.length}个薪资数据点`;
}

/**
 * Extracts common keywords from scraped job titles and company descriptions.
 *
 * @param jobs - Array of scraped jobs
 * @param direction - The expected direction for keyword context
 * @returns Array of top keywords
 */
function extractKeywords(jobs: ScrapedJob[], direction: ExpectedDirection): string[] {
  const keywordSet = getKeywordSet(direction);
  const allText = jobs
    .map((j) => `${j.title} ${j.company}`)
    .join(' ');

  // Match direction keywords found in scraped data
  const foundKeywords: string[] = [];
  for (const kw of keywordSet.keywords) {
    if (allText.includes(kw)) {
      foundKeywords.push(kw);
    }
  }

  // Always include some baseline keywords from the direction
  const baselineKeywords = keywordSet.keywords.slice(0, 5);
  for (const kw of baselineKeywords) {
    if (!foundKeywords.includes(kw)) {
      foundKeywords.push(kw);
    }
  }

  return foundKeywords.slice(0, 10);
}

/**
 * Generates a trends description from scraped job data.
 *
 * @param jobs - Array of scraped jobs
 * @param direction - The expected direction
 * @returns Trends description string
 */
function generateTrends(jobs: ScrapedJob[], direction: ExpectedDirection): string {
  const directionLabel = DIRECTION_LABELS[direction];

  if (jobs.length === 0) {
    return `当前「${directionLabel}」方向岗位招聘数据暂未成功获取。根据行业经验，该方向在医药/器械行业保持稳定需求。`;
  }

  const locations = new Set(jobs.map((j) => j.location).filter((l) => l && l !== '未知地点'));
  const locationStr = locations.size > 0 ? Array.from(locations).slice(0, 5).join('、') : '全国';

  return `「${directionLabel}」方向当前在招聘市场共有${jobs.length}个相关岗位在招，主要分布在${locationStr}等地。该方向在医药/器械行业保持持续的人才需求，企业类型涵盖外资药企、国内创新药企及CRO公司。`;
}

/**
 * Extracts common requirements from scraped and curated job data.
 *
 * @param direction - The expected direction
 * @returns Array of common requirements
 */
function extractCommonRequirements(direction: ExpectedDirection): string[] {
  const keywordSet = getKeywordSet(direction);
  const curatedJobs = getJobsByDirection(direction);

  // Collect requirements from curated jobs
  const allRequirements: string[] = [];
  for (const job of curatedJobs) {
    allRequirements.push(...job.requirements);
  }

  // Deduplicate and take top requirements
  const uniqueRequirements = Array.from(new Set(allRequirements));

  // Always include skill-based requirements from keyword set
  const skillRequirements = keywordSet.requiredSkills.map(
    (skill) => `具备${skill}`
  );

  // Combine and deduplicate
  const combined = [...uniqueRequirements, ...skillRequirements];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const req of combined) {
    const key = req.substring(0, 20);
    if (!seen.has(key) && req.length > 3) {
      seen.add(key);
      result.push(req);
    }
    if (result.length >= 8) break;
  }

  return result;
}

/**
 * Generates a market summary from all available data.
 *
 * @param jobs - Array of scraped jobs
 * @param direction - The expected direction
 * @param salaryRange - Computed salary range
 * @returns Summary string
 */
function generateSummary(
  jobs: ScrapedJob[],
  direction: ExpectedDirection,
  salaryRange: string
): string {
  const directionLabel = DIRECTION_LABELS[direction];
  const curatedJobs = getJobsByDirection(direction);

  const jobCount = jobs.length + curatedJobs.length;

  return `「${directionLabel}」方向是医药/器械行业的核心岗位之一，当前市场上共有${jobCount}个相关岗位在招。${salaryRange}。建议求职者关注该方向的核心技能要求，完善简历中的关键词和量化成果，提升求职竞争力。`;
}

/**
 * Generates JobMarketInfo from the curated job database as a fallback.
 * Used when web scraping fails or returns insufficient data.
 *
 * @param direction - The expected career direction
 * @returns JobMarketInfo based on curated data
 */
function generateFallbackMarketInfo(direction: ExpectedDirection): JobMarketInfo {
  console.log('[WebScrape] Using fallback data from curated jobDatabase');

  const keywordSet = getKeywordSet(direction);
  const curatedJobs = getJobsByDirection(direction);

  // Build salary range from curated jobs
  const salaryStrings = curatedJobs.map((j) => j.salaryRange);
  const salaryRange =
    salaryStrings.length > 0
      ? salaryStrings.join('；')
      : keywordSet.salaryRange;

  const directionLabel = DIRECTION_LABELS[direction];

  return {
    trends: `「${directionLabel}」方向在医药/器械行业保持稳定招聘需求。根据行业数据，当前市场上该方向岗位主要集中在一线城市（上海、北京、广州），外资药企和国内创新药企均有持续招聘。该方向对专业背景和行业经验有较高要求，资深人才市场竞争力较强。`,
    commonRequirements: extractCommonRequirements(direction),
    salaryRange,
    keywords: keywordSet.keywords.slice(0, 10),
    summary: generateSummary([], direction, salaryRange),
  };
}

/**
 * Aggregates scraped job data into a JobMarketInfo object.
 *
 * @param jobs - Array of scraped jobs
 * @param direction - The expected direction
 * @returns Aggregated JobMarketInfo
 */
function aggregateMarketInfo(
  jobs: ScrapedJob[],
  direction: ExpectedDirection
): JobMarketInfo {
  const salaryRange = analyzeSalaryRange(jobs);
  const keywords = extractKeywords(jobs, direction);
  const trends = generateTrends(jobs, direction);
  const commonRequirements = extractCommonRequirements(direction);
  const summary = generateSummary(jobs, direction, salaryRange);

  return {
    trends,
    commonRequirements,
    salaryRange,
    keywords,
    summary,
  };
}

/**
 * Searches the web for current job market information for the given direction.
 *
 * Attempts to scrape medical recruitment websites (丁香人才, 医药人才网).
 * If scraping fails or returns no results, falls back to the curated
 * job database to generate market info.
 *
 * @param direction - The expected career direction
 * @returns Aggregated job market information
 */
export async function searchJobMarket(
  direction: ExpectedDirection
): Promise<JobMarketInfo> {
  const searchTerm = DIRECTION_SEARCH_TERMS[direction] || DIRECTION_LABELS[direction];
  console.log(`[WebScrape] Searching job market for: ${searchTerm}`);

  const scrapedJobs: ScrapedJob[] = [];

  // Try scraping DXY first
  try {
    const dxyJobs = await scrapeDxyJobs(searchTerm);
    console.log(`[WebScrape] DXY returned ${dxyJobs.length} jobs`);
    scrapedJobs.push(...dxyJobs);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[WebScrape] DXY scraping failed: ${msg}`);
  }

  // Try scraping Jobuy as secondary source
  try {
    const jobuyJobs = await scrapeJobuyJobs(searchTerm);
    console.log(`[WebScrape] Jobuy returned ${jobuyJobs.length} jobs`);
    scrapedJobs.push(...jobuyJobs);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[WebScrape] Jobuy scraping failed: ${msg}`);
  }

  // If we got enough scraped data, aggregate it
  if (scrapedJobs.length >= 3) {
    console.log(`[WebScrape] Aggregating ${scrapedJobs.length} scraped jobs`);
    return aggregateMarketInfo(scrapedJobs, direction);
  }

  // Fallback to curated data
  console.log(
    `[WebScrape] Insufficient scraped data (${scrapedJobs.length} jobs), using fallback`
  );
  return generateFallbackMarketInfo(direction);
}
