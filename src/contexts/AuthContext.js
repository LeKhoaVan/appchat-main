import { createContext, useReducer, useEffect, useRef } from 'react'
import { authReducer } from '../reducers/authReducer'
// import { apiUrl, 'appchatnhom9' } from './constants'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'


export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
	const [authState, dispatch] = useReducer(authReducer, {
		authLoading: true,
		isAuthenticated: false,
		user: null
	})
	const socket = useRef();

    //authenticate user
    const loadUser = async () => {
		if (localStorage['appchatnhom9']) {
			setAuthToken(localStorage['appchatnhom9'])
		}

		try {
			const response = await axios.get('http://13.212.6.208:8800/api/auth')
			if (response.data.success) {
				dispatch({
					type: 'SET_AUTH',
					payload: { isAuthenticated: true, user: response.data.user }
				})
			}
		} catch (error) {
			localStorage.removeItem('appchatnhom9')
			setAuthToken(null)
			dispatch({
				type: 'SET_AUTH',
				payload: { isAuthenticated: false, user: null }
			})
		}
	}

	//useEffect(() => loadUser(), [])
	useEffect(() => {
		loadUser();
	  }, []); 

	//register
	const registerUser = async userForm => {
		try {
			const response = await axios.post('http://13.212.6.208:8800/api/auth/register', userForm)

			// if (response.data.success)
			// 	localStorage.setItem(
			// 		'appchatnhom9',
			// 		response.data.accessToken
			// 	)

			//await loadUser()

			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}

	const checkOTP = async userForm =>{
		try {
			const response = await axios.put('http://13.212.6.208:8800/api/auth/verifyOtp', userForm)

			if (response.data.success)
				localStorage.setItem(
					'appchatnhom9',
					response.data.accessToken
				)

			await loadUser()

			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}

	 // Login
	const loginUser = async userForm => {
		try {
			const response = await axios.post('http://13.212.6.208:8800/api/auth/login', userForm)
			if (response.data.success)
				localStorage.setItem(
					'appchatnhom9',
					response.data.accessToken
				)

				await loadUser()

			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}


	const logoutUser = () => {
		localStorage.removeItem('appchatnhom9')
		dispatch({
			type: 'SET_AUTH',
			payload: { isAuthenticated: false, user: null }
		})
	}
		//changePassword
		const changePassUser = async userForm => {
			try {
				const response = await axios.put('http://13.212.6.208:8800/api/auth/changePassword', userForm)
				return response.data
			} catch (error) {
				if (error.response.data) return error.response.data
				else return { success: false, message: error.message }
			}
		}

    const authContextData = {loginUser , authState , logoutUser, registerUser, changePassUser, checkOTP , socket}
	// Return provider
	return (
		<AuthContext.Provider value={authContextData}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContextProvider