/* eslint-disable react/jsx-key */

import DialogueModal from '../modals/DialogueModal/DialogueModalClient';
import fetchStatus from '../../lib/fetchStatus';
import fetchCompletions from '../../lib/fetchCompletions';
import MatrixSelect from './MatrixSelectClient';
import RefreshButton from './RefreshButton';
import FilterExpr from './FilterExpr';
import HelpText from './HelpText.js';
import { KangasButton, AboutDialog, SelectButton, HelpButton, GroupByButton, SortByButton } from './Buttons';
import styles from './SettingsBar.module.scss';
import classNames from 'classnames/bind';
import { Suspense } from 'react';
import fetchDatagrids from '../../lib/fetchDatagrids';
import fetchDataGrid from '../../lib/fetchDatagrid';

const cx = classNames.bind(styles);


const SettingsBar = async ({ query }) => {
    const status = await fetchStatus();
    const options = await fetchDatagrids();
    const completions = await fetchCompletions(query?.dgid);
    const firstRow = await fetchDataGrid( { ...query, select: null, limit: 1 } );

    return (
        <div className={cx('settings-bar')}>
            <div className={cx('left-settings-bar')}>
                <DialogueModal fullScreen={false} toggleElement={<KangasButton />}>
                    <Suspense fallback={<div>Loading</div>}>
                        <AboutDialog status={status} />
                    </Suspense>
                </DialogueModal>
                <Suspense fallback={<>FDKLSF</>}>
                    <MatrixSelect query={query} options={options} />
                </Suspense>
                <RefreshButton query={query} />
            </div>
            <div className={cx('right-settings-bar')}>
                <GroupByButton />
                <SortByButton />
                <SelectButton columns={firstRow?.displayColumns} />
                <FilterExpr query={query} completions={completions} />
                <DialogueModal fullScreen={false} toggleElement={<HelpButton />}>
                    <HelpText />
                </DialogueModal>
            </div>
        </div>
    );
};

export default SettingsBar;