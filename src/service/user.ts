import axios from 'axios'
import authHeader from './authHeader'
import config from '../env'

const API_URL = process.env.REACT_APP_API_URL || config.API_URL