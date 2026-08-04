import mammoth from 'mammoth';
import type { ParsedResume, StructuredResumeData } from '../types';

/**
 * Parses a .docx file buffer into raw text and attempts to extract
 * structured resume information (basic info, education, work experience,
 * project experience, skills).
 *
 * @param buffer - The .docx file as a Buffer
 * @returns Parsed resume containing raw text and structured data
 */
export async function parseDocx(buffer: Buffer): Promise<ParsedResume> {
  // Convert .docx to plain text using mammoth
  const result = await mammoth.extractRawText({ buffer });
  const rawText: string = result.value;

  if (!rawText || rawText.trim().length === 0) {
    throw new Error('简历文件内容为空，请检查文件是否正确。');
  }

  // Attempt to extract structured information from the raw text
  const structured = extractStructuredData(rawText);

  return {
    rawText,
    structured,
  };
}

/**
 * Extracts structured resume data from plain text using heuristic parsing.
 * Identifies sections by common Chinese/English section headers.
 *
 * @param text - The raw resume text
 * @returns Structured resume data
 */
function extractStructuredData(text: string): StructuredResumeData {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  // Section header patterns (Chinese + English)
  const sectionPatterns = {
    basicInfo: /个人信息|基本信息|联系方式|Profile|Personal|Contact/i,
    education: /教育背景|教育经历|教育\/培训|教育培训|教育信息|培训经历|学历|Education|Academic|Train/i,
    workExperience: /工作经历|工作经验|工作履历|Work Experience|Employment|Professional Experience/i,
    projectExperience: /项目经历|项目经验|Project Experience|Projects/i,
    skills: /技能|专业技能|核心技能|职业技能|Skills|Technical Skills|Competencies/i,
  };

  const sections: Record<keyof StructuredResumeData, string[]> = {
    basicInfo: [],
    education: [],
    workExperience: [],
    projectExperience: [],
    skills: [],
  };

  let currentSection: keyof StructuredResumeData | null = null;

  for (const line of lines) {
    let matchedSection: keyof StructuredResumeData | null = null;

    // Check if this line is a section header
    for (const [key, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line) && line.length < 30) {
        matchedSection = key as keyof StructuredResumeData;
        break;
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
      continue;
    }

    // If we have a current section, add the line to it
    if (currentSection) {
      sections[currentSection].push(line);
    } else {
      // Lines before any section header go to basicInfo
      sections.basicInfo.push(line);
    }
  }

  return {
    basicInfo: sections.basicInfo.join('\n') || '未能提取基本信息',
    education: sections.education.join('\n') || '未能提取教育背景',
    workExperience: sections.workExperience.join('\n') || '未能提取工作经历',
    projectExperience: sections.projectExperience.join('\n') || '未能提取项目经历',
    skills: sections.skills.join('\n') || '未能提取技能信息',
  };
}
