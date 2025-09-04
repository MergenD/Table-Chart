import { Spin, Table, type TableColumnsType } from 'antd';
import type { ProcessedShareholderData } from '../../types';
import styles from './table.module.scss';

interface Props {
  data: ProcessedShareholderData[];
  isLoading?: boolean;
  isError?: boolean;
}

const TableComponent = ({ data, isLoading, isError }: Props) => {
  const columns: TableColumnsType<ProcessedShareholderData> = [
    {
      title: 'Акционер',
      dataIndex: 'holder',
      key: 'holder',
      sorter: (a, b) => a.holder.localeCompare(b.holder),
    },
    {
      title: 'Доля (%)',
      dataIndex: 'share_percent',
      key: 'share_percent',
      sorter: (a, b) => a.share_percent_number - b.share_percent_number,
      render: (value: string) => `${value}%`,
    },
  ];

  const safeData = Array.isArray(data) ? data : [];

  const currentDate = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isError) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        Ошибка загрузки данных
      </div>
    );
  }

  return (
    <div>
      {!isLoading ? (
        <>
          <Table
            columns={columns}
            dataSource={safeData}
            rowKey='id'
            bordered
            pagination={false}
            className={styles.table}
            size='middle'
          />
          <div
            style={{
              marginTop: '16px',
              textAlign: 'left',
              fontSize: '12px',
              color: '#666',
              fontStyle: 'italic',
            }}
          >
            Дата последнего обновления этой структуры: {currentDate}
          </div>
        </>
      ) : (
        <Spin
          size='large'
          style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
        />
      )}
    </div>
  );
};

export default TableComponent;
