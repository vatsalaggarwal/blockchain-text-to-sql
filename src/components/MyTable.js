import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CSVLink } from "react-csv";
import { SERVER_BASE_URL } from '../constants';
import { parseParametrisedQuery } from '../utils';

const dummyData = [
    { firstname: 'X', lastname: 'Y', email: 'x@y.com' },
    { firstname: 'A', lastname: 'B', email: 'a@b.com' }
];

export default function MyTable({ id, updateData, titleProp, queryProp, valueProp, params }) {
    const [title, setTitle] = useState(titleProp);
    const [query, setQuery] = useState(queryProp);
    const [value, setValue] = useState(valueProp);
    const [editMode, setEditMode] = useState(valueProp === undefined);

    const handleExecuteOnClick = (_event) => {
        const parsedQuery = parseParametrisedQuery(query, params);
        console.log(parsedQuery);
    
        // make API call and update card
        updateData(id, { title, query, value: dummyData });
        setValue(dummyData);
        setEditMode(false);
    }

    const handleEditOnClick = (_event) => setEditMode(true);
    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleQueryChange = (event) => setQuery(event.target.value);

    const renderEditMode = () => {
        return <>
            <Card.Text>
                <Form.Control type="text" placeholder="Enter metric title" onChange={handleTitleChange} value={title} />
                <Form.Control
                    as="textarea"
                    placeholder="Enter your query"
                    style={{ height: '80px' }}
                    onChange={handleQueryChange}
                    maxLength={1024}
                    value={query}
                />
            </Card.Text>
            <Button variant="primary" onClick={handleExecuteOnClick}>Execute</Button>
        </>
    }

    const renderHeader = () => {
        return <thead>
            <tr>
                {value && Object.keys(value[0]).map((key, idx) => <th key={idx}>{key}</th>)}
            </tr>
        </thead>
    }

    const renderBody = () => {
        return <tbody>
            {value && value.map((v, idx) => {
                return <tr key={idx}>
                    {Object.values(v).map((r, idx) => <td key={`row-${idx}`}>{r}</td>)}
                </tr>
            })}
        </tbody>;
    }

    const renderViewOnlyMode = () => {
        return <>
            <Card.Subtitle className='mb-3'>{title}</Card.Subtitle>
            <Table striped bordered hover size="sm">
                {renderHeader()}
                {renderBody()}
            </Table>
            <CSVLink data={value}>Export CSV</CSVLink>&nbsp;&nbsp;
            <Button variant="primary" onClick={handleEditOnClick}>Edit</Button>
        </>
    }

    return <Card style={{ width: '40rem', height: '24rem' }} className="my-5 me-4" border='success'>
        <Card.Body>
            {editMode ? renderEditMode() : renderViewOnlyMode()}
        </Card.Body>
    </Card>
}