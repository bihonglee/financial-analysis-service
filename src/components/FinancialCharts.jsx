import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './FinancialCharts.css';

const FinancialCharts = ({ financialData }) => {
  // 재무 데이터 가공
  const chartData = useMemo(() => {
    if (!financialData || financialData.length === 0) {
      return { balanceSheet: [], incomeStatement: [] };
    }

    // 재무상태표 데이터
    const balanceSheet = financialData.filter(item => item.sj_div === 'BS');
    const incomeStatement = financialData.filter(item => item.sj_div === 'IS');

    // 주요 계정 추출 및 차트 데이터 형식으로 변환
    const processChartData = (data, accountNames) => {
      const accounts = accountNames.map(name => 
        data.find(item => item.account_nm === name)
      ).filter(Boolean);

      if (accounts.length === 0) return [];

      // 기간별 데이터 구성
      const periods = [];
      
      accounts.forEach(account => {
        const period = {
          account: account.account_nm,
          당기: account.thstrm_amount ? parseInt(account.thstrm_amount) : 0,
          전기: account.frmtrm_amount ? parseInt(account.frmtrm_amount) : 0,
          전전기: account.bfefrmtrm_amount ? parseInt(account.bfefrmtrm_amount) : 0
        };
        periods.push(period);
      });

      return periods;
    };

    // 재무상태표 주요 계정
    const bsAccounts = ['자산총계', '부채총계', '자본총계'];
    const bsData = processChartData(balanceSheet, bsAccounts);

    // 손익계산서 주요 계정
    const isAccounts = ['매출액', '영업이익', '당기순이익(손실)'];
    const isData = processChartData(incomeStatement, isAccounts);

    return {
      balanceSheet: bsData,
      incomeStatement: isData
    };
  }, [financialData]);

  // 금액 포맷팅 (억원 단위)
  const formatAmount = (value) => {
    if (!value || value === 0) return '0';
    const amount = typeof value === 'string' ? parseInt(value) : value;
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억`;
    } else if (amount >= 10000) {
      return `${(amount / 10000).toFixed(1)}만`;
    }
    return amount.toLocaleString();
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.account}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {`${entry.name}: ${formatAmount(entry.value)}원`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!financialData || financialData.length === 0) {
    return (
      <div className="charts-placeholder">
        <p>재무 데이터를 먼저 조회해주세요.</p>
      </div>
    );
  }

  const { balanceSheet, incomeStatement } = chartData;

  return (
    <div className="financial-charts">
      <h2 className="charts-title">재무 데이터 시각화</h2>

      {/* 재무상태표 차트 */}
      {balanceSheet.length > 0 && (
        <div className="chart-section">
          <h3 className="chart-section-title">재무상태표 주요 항목</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={balanceSheet} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="account" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatAmount(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="당기" fill="#4a90e2" name="당기" />
              <Bar dataKey="전기" fill="#50c878" name="전기" />
              {balanceSheet.some(item => item.전전기 > 0) && (
                <Bar dataKey="전전기" fill="#ff6b6b" name="전전기" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 손익계산서 차트 */}
      {incomeStatement.length > 0 && (
        <div className="chart-section">
          <h3 className="chart-section-title">손익계산서 주요 항목</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={incomeStatement} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="account" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatAmount(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="당기" 
                stroke="#4a90e2" 
                strokeWidth={2}
                name="당기"
                dot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="전기" 
                stroke="#50c878" 
                strokeWidth={2}
                name="전기"
                dot={{ r: 5 }}
              />
              {incomeStatement.some(item => item.전전기 > 0) && (
                <Line 
                  type="monotone" 
                  dataKey="전전기" 
                  stroke="#ff6b6b" 
                  strokeWidth={2}
                  name="전전기"
                  dot={{ r: 5 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 데이터가 없는 경우 */}
      {balanceSheet.length === 0 && incomeStatement.length === 0 && (
        <div className="charts-placeholder">
          <p>표시할 수 있는 주요 계정 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default FinancialCharts;

