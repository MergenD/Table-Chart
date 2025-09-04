import Chart from '../components/chart/Chart';
import Table from '../components/table/Table';
import { useShareholderData } from '../hooks/useShareholderData';
import styles from './layout.module.scss';

const Layout = () => {
  const { data, loading, error } = useShareholderData();

  return (
    <div>
      <div className={styles.container}>
        <h1>Структура акционеров</h1>
        <div className={styles.content}>
          <div className={styles.tableSection}>
            <Table data={data} isLoading={loading} isError={!!error} />
          </div>
          <div className={styles.chartSection}>
            <Chart data={data} isLoading={loading} isError={!!error} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
