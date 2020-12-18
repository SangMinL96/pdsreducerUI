import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useLazyQuery } from '@apollo/react-hooks';
import { useDataState } from '../JoinUserContext';
import { GET_USER_AUTH } from '../JoinUserQuery';

const columns = [
  { field: 'AUTH_TP_CD', headerName: '인증유형', width: 100 },
  { field: 'AUTH_USR_ID', headerName: '인증아이디', width: 170 },
  { field: 'ATV_YN', headerName: '활성화상태', width: 110 }
];

export default function DetailTable() {
  const [row, setRow] = useState([]);
  const { detailTableData: USR_ID } = useDataState();
  const [getTable, { data: tableData }] = useLazyQuery(GET_USER_AUTH);

  useEffect(() => {
    if (USR_ID !== undefined) {
      getTable({ variables: { USR_ID, ver: 'v1' } });
    }
    if (tableData !== undefined) {
      setRow(tableData?.getUserAuth);
    }
  }, [USR_ID, getTable, tableData]);
  return (
    <div style={{ height: 155, width: '100%' }}>
      <DataGrid
        rows={row && row}
        columns={columns}
        headerHeight={40}
        rowHeight={30}
        hideFooter={true}
      />
    </div>
  );
}
