import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Metric from './Metric';
import MyTable from './MyTable';
import Settings from './Settings';

export default function App() {
    const [data, setData] = useState({});
    const [params, setParams] = useState({});

    useEffect(() => {
        let cached = JSON.parse(window.localStorage.getItem('ci-data')) || {};
        setData(cached);

        cached = JSON.parse(window.localStorage.getItem('ci-params')) || {};
        setParams(cached);
    }, []);

    useEffect(() => window.localStorage.setItem('ci-params', JSON.stringify(params)), [params]);

    const updateData = (id, dataToUpdate) => {
        const newData = { ...data };
        newData[id] = dataToUpdate;

        window.localStorage.setItem('ci-data', JSON.stringify(newData));
        setData(newData);
    }

    const handleMetricOnClick = (_event) => {
        const id = `metric-${Object.keys(data).length + 1}`
        let newData = { ...data };
        newData[id] = {};
        setData(newData);
    }

    const handleTableOnClick = (_event) => {
        const id = `table-${Object.keys(data).length + 1}`
        let newData = { ...data };
        newData[id] = {};
        setData(newData);
    }

    handleClearOnClick = (_event) => {
        window.localStorage.setItem('ci-data', JSON.stringify({}));
        setData({});
    }
    const renderData = () => {
        const ret = Object.entries(data).map(([k, v]) => {
            if (k.includes('metric')) {
                return <Metric
                    key={k}
                    id={k}
                    updateData={updateData}
                    titleProp={v && v.title}
                    queryProp={v && v.query}
                    valueProp={v && v.value}
                    params={params}
                />
            } else {
                return <MyTable
                    key={k}
                    id={k}
                    updateData={updateData}
                    titleProp={v && v.title}
                    queryProp={v && v.query}
                    valueProp={v && v.value}
                    params={params}
                />
            }
        });
        return ret;
    }

    return <div className="app">
        <Settings params={params} updateParams={setParams} />
        <div className='d-flex'>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Add
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={handleMetricOnClick}>Metric</Dropdown.Item>
                    <Dropdown.Item onClick={handleTableOnClick}>Table</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Button variant='danger' onClick={handleClearOnClick}>Clear</Button>
        </div>
        <div className='d-flex flex-row justify-content-start flex-wrap'>
            {renderData()}
        </div>
    </div>;
}
