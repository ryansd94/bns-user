import React, { useEffect, useState } from 'react';
import { getShopIndex } from '../../../helpers'
import { createInstance } from '../../../services/base';
import Table from '../../../components/table/Table';
import { Trans } from 'react-i18next';


const services = createInstance('/api');
const columns = [
    { field: 'name', headerName: <Trans>Tên</Trans>, width: 350, flex: 2 },
    { field: 'number', headerName: <Trans>Thứ tự</Trans>, width: 150, flex: 1 },
    { field: 'note', headerName: <Trans>Ghi chú</Trans>, width: 450, flex: 2 },
    //{
    //    field: 'fullName',
    //    headerName: 'Full name',
    //    description: 'This column has a value getter and is not sortable.',
    //    sortable: false,
    //    width: 160,
    //    valueGetter: (params) =>
    //        `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''
    //        }`,
    //},
];
const BranchDataGrid = React.memo((props) => {
    const baseUrl = '/cf_branch';
    const url = `${baseUrl}/GetAllData`;
    const [page, setPage] = useState(0);
    const [rowsCount, setRowsCount] = useState(0);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        setLoading(true);
        const res = await services.post(url, {
            draw: page,
            start: page == 0 ? 0 : (page * 10),
            length: 10,
            shopIndex: getShopIndex()
        });
        setData(res.data && res.data.data);
        setRowsCount(res.data && res.data.recordsTotal);
        setLoading(false);
    };
    return (

        <Table
            rowsCount={rowsCount}
            columns={columns}
            rows={data}
            onPageChange={(newPage) => setPage(newPage)}
            loading={loading}
        />

    );
});


export default BranchDataGrid;