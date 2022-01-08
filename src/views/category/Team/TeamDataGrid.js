import React, {
    useEffect, useState
} from 'react';
import { getShopIndex } from 'helpers'
import Table from 'components/table/Table';
import { useTranslation } from 'react-i18next';
import { getTeam } from 'services'
import PropTypes from 'prop-types';



const TeamDataGrid = React.memo((props) => {
    console.log("render AREA GRID");
    const { t } = useTranslation();
    const baseUrl = '/jm_team';
    const url = `${baseUrl}`;
    const { data } = props;
    const [page, setPage] = useState(0);

    const [loading, setLoading] = useState(false);
    const [sortModel, setSortModel] = useState([
    ]);
    const columns = [
        { field: 'name', headerName: t('Tên'), width: 350, flex: 2 },
        {
            field: 'number', headerName: t('Thứ tự'), width: 150, flex: 1
        },
        {
            field: 'note', headerName: t('Ghi chú'), width: 450, flex: 2
        },
        { field: 'branchName', headerName: t('Chi nhánh'), width: 400, flex: 2 }
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

    //const onSortModel = useCallback(() => setSortModel(sortModel), [sortModel])

    //useEffect(() => {
    //    async function fetchData() {
    //        setLoading(true);
    //        const res = await getTeam({
    //            draw: page,
    //            start: page == 0 ? 0 : (page * 10),
    //            length: 10,
    //        });
    //        setData(res);
    //        console.log(res.data);
    //        setLoading(false);
    //    }
    //    fetchData();
    //}, [page, sortModel]);

    return (

        <Table
            rowsCount={data && data.recordsTotal}
            columns={columns}
            rows={data.data && data.data.items}
            sortModel={sortModel}
            onPageChange={(newPage) => setPage(newPage)}
            onSortModelChange={(model) => setSortModel(model)}
            loading={loading}
        />

    );
});


TeamDataGrid.propTypes = {
    data: PropTypes.object
}
export default TeamDataGrid;