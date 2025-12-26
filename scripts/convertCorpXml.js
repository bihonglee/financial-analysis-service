import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
});

try {
  // corp.xml 파일 읽기 (절대 경로 사용)
  const xmlPath = 'C:\\Users\\bihon\\OneDrive\\Desktop\\HelloAI\\corp.xml';
  const xmlData = fs.readFileSync(xmlPath, 'utf-8');
  
  // XML 파싱
  const jsonObj = parser.parse(xmlData);
  
  // list 배열 추출
  const companies = jsonObj.result.list || [];
  
  // 필요한 필드만 추출하여 정리
  const cleanedData = companies.map(company => ({
    corp_code: company.corp_code || '',
    corp_name: company.corp_name || '',
    corp_eng_name: company.corp_eng_name || '',
    stock_code: company.stock_code || '',
    modify_date: company.modify_date || ''
  }));
  
  // public/data 디렉토리 생성 (없으면)
  const outputDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // JSON 파일로 저장
  const outputPath = path.join(outputDir, 'corp.json');
  fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2), 'utf-8');
  
  console.log(`✅ 변환 완료: ${cleanedData.length}개 회사 데이터가 ${outputPath}에 저장되었습니다.`);
} catch (error) {
  console.error('❌ 변환 중 오류 발생:', error.message);
  process.exit(1);
}

