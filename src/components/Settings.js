import { useEffect, useState } from 'react';
import * as _ from 'lodash';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Settings({ params, updateParams }) {
    const handleOnClick = (_event) => {
        let newParams = { ...params };
        const key = 'param' + String(Object.keys(params).length + 1);
        newParams[key] = { name: '', value: '' };

        updateParams(newParams);
    }

    const handleOnChange = (event) => {
        const id = event.target.getAttribute('id');

        const newParams = { ...params };
        _.set(newParams, id, event.target.value);
        updateParams(newParams);
    }

    const renderParams = () => {
        if (!params) { return; }
        return Object.keys(params).map((k, idx) => {
            return <div key={idx} className='d-flex justify-content-between'>
                <Form.Control
                    id={`${k}.name`}
                    type="text" placeholder="Name"
                    onChange={handleOnChange}
                    value={params[k].name}
                />
                <Form.Control
                    id={`${k}.value`}
                    type="text"
                    placeholder="Value"
                    onChange={handleOnChange}
                    value={params[k].value}
                />
            </div>
        })
    }

    return <Accordion className='mb-3'>
        <Accordion.Item eventKey="0">
            <Accordion.Header>Settings</Accordion.Header>
            <Accordion.Body>
                <Button onClick={handleOnClick} className='mb-2'>Add parameter</Button>
                {renderParams()}
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
}