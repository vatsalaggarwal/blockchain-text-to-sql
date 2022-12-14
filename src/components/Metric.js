import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { SERVER_BASE_URL } from '../constants';
import { parseParametrisedQuery } from '../utils';

export default function Metric({ id, updateData, titleProp, queryProp, valueProp, params }) {
    const [title, setTitle] = useState(titleProp);
    const [query, setQuery] = useState(queryProp);
    const [value, setValue] = useState(valueProp);
    const [editMode, setEditMode] = useState(valueProp === undefined);

    const handleExecuteOnClick = (_event) => {
        const parsedQuery = parseParametrisedQuery(query, params);
        console.log(parsedQuery);
    
        // make API call and update card
        var payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'title': title,
                'query': query,
            })
        }
        fetch(`${SERVER_BASE_URL}/metric`, payload)
            .then(_response => {
                _response.json()
                    .then(j => {
                        const result = j['value'];
                        updateData(id, { title, query, value: result });
                        setValue(result);
                        setEditMode(false);
                    }).catch(_error => {
                        console.log(_error);
                    });
            }).catch(_error => {
                console.log(_error);
            });
    }

    const handleEditOnClick = (_event) => {
        setEditMode(true);
    }

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

    const renderViewOnlyMode = () => {
        return <>
            <Card.Title>{value}</Card.Title>
            <Card.Subtitle className='mb-3'>{title}</Card.Subtitle>
            <Button variant="primary" onClick={handleEditOnClick}>Edit</Button>
        </>
    }

    return <Card style={{ width: '24rem', height: '18rem' }} className="my-5 me-4" border='success'>
        <Card.Body>
            {editMode ? renderEditMode() : renderViewOnlyMode()}
        </Card.Body>
    </Card>
}
