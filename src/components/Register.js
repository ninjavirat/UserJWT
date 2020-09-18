import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";




const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
}));


export default function Register() {
    const classes = useStyles();
    const fetchData = React.useCallback(() => {
        axios.get(
            '/api/v1/todos')
            .then((response) => {
                console.log('Data ', response);
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    React.useEffect(() => {
        fetchData()
    }, [fetchData])
    return (
        <div>
            <p>todolist loading....</p>
        </div>
    );
}



