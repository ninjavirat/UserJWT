import React, { createContext, useState, useEffect } from 'react'
import Axios from "axios"
import { useHistory } from "react-router-dom";

export const FetchContext = createContext()

export const FetchProvider = ({ children }) => {
    const [token, setToken] = useState('')
    let history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const authAxios = Axios.create({
        baseURL: '/api/v1'
    })

    const setAuthState = () => {
        return localStorage.getItem('token') || ''
    }

    useEffect(() => {
        const tokenItem = setAuthState()
        setToken(tokenItem)
        if (token.length > 0) {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [setAuthState])

    authAxios.interceptors.request.use(config => {
        const tokenItem = token || setAuthState()
        console.log('token', tokenItem)
        config.headers.Authorization = `Bearer ${tokenItem}`
        return config
    }, error => {
        return Promise.reject(error)
    })

    const login = async (email, password) => {
        const { data } = await Axios.post('/api/v1/login', {
            email, password
        })
        console.log('data', data);
        localStorage.setItem('token', data.value.token)
        setToken(data.value.token)
        history.push("/todolist");
    }


    const logout = () => {
        localStorage.removeItem('token')
        history.push('/login')
        setIsAuthenticated(false)
    }

    return <FetchContext.Provider value={{ authAxios, login, isAuthenticated, logout }}>{children}</FetchContext.Provider>
}