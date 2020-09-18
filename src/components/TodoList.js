import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FetchContext } from '../contexts/FetchContext';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { Button } from '@material-ui/core';

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
    button: {
        marginTop: 22
    }
}));



export default function TodoList() {
    const { authAxios } = useContext(FetchContext);
    const [title, setTitle] = React.useState('');
   // const [additem, setAddItem] = React.useState('');
    const [items, setItems] = React.useState([])
   // const [Add, setAdd] = React.useState(true)
    const [isEditing, setIsEditing] = React.useState(false)
    const [EditItem, setEditItem] = React.useState({})


    const classes = useStyles();
    const fetchData = React.useCallback(() => {
        authAxios.get(
            '/todos')
            .then((response) => {

                setItems(prev => ([...prev, ...response.data]))

                console.log('pika-response', response.data)

            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    React.useEffect(() => {
        fetchData()
    }, [fetchData])


    const handleDeleteItem = async (DeletedItem) => {
        const newList = authAxios.delete(
            `/todos/${DeletedItem._id}`)
            .then((response) => {
                setItems(prev => {
                    return prev.filter(todo => todo._id !== DeletedItem._id)
                })

                console.log('pika-deleted-response', response.data)

            })
            .catch((error) => {
                console.log(error)
            })

        // const newItemList = items.filter(item=> item._id !== DeletedItem._id);
        // setItems(newItemList);

    }

    const handleEditItem = async () => {
        console.log('EditItem', EditItem)
        const newList = authAxios.put(
            `/todos/${EditItem._id}`, { title })
            .then((response) => {
                setItems(prev => prev.map(item => EditItem._id === item._id ? { ...item, title } : item))
                setTitle('')
                console.log('Edit-Response', response)

            })
            .catch((error) => {
                console.log(error)
            })
        setIsEditing(false)
        // const newItemList = items.filter(item=> item._id !== DeletedItem._id);
        // setItems(newItemList);

    }

    const handleAddItem = () => {
        authAxios.post(
            `/todos/`, { title })
            .then((response) => {

                setItems(prev => ([...prev, response.data.todo]))

            })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <div>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Add todo"
                    margin="normal"
                    onChange={(event) => setTitle(event.target.value)}
                    value={title}

                />
                {isEditing ? (
                    <Button className={classes.button} variant="contained" color="primary" onClick={handleEditItem} >
                        UPDATE
                    </Button>
                ) : (

                        <Button className={classes.button} variant="contained" color="primary" onClick={handleAddItem} >
                            ADD
                        </Button>

                    )}



            </form>


            <Container className={classes.container} maxWidth="md">
                {!items.length
                    ?
                    <Typography variant="h6" color="error">No Data to display</Typography>
                    :
                    (<List>
                        {items.length > 0 && items.map(item => {

                            return (
                                <ListItem key={item._id} button>
                                    <ListItemText primary={item.title} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="edit" >
                                            <EditIcon onClick={() => {
                                                setEditItem(item)
                                                setTitle(item.title)
                                                setIsEditing(true)
                                            }} />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" >
                                            <DeleteIcon onClick={() => handleDeleteItem(item)} />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>)
                }
            </Container>
        </div>
    );
}



