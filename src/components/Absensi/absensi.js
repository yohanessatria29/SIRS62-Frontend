import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { HiSaveAs } from 'react-icons/hi'
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import style from './absensi.module.css'
import Table from 'react-bootstrap/Table'
import checkIcon from '../Images/check.png'
import silangIcon from '../Images/silang.png'

const Absensi = () => {
    const [namaRS, setNamaRS] = useState('')
    const [daftarProvinsi, setDaftarProvinsi] = useState([])
    const [daftarKabKota, setDaftarKabKota] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [provinsiId, setProvinsiId] = useState(null)
    const [kabKotaId, setKabKotaId] = useState(null)
    const [dataAbsensi, setDataAbsensi] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        refreshToken()
        getProvinsi()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const refreshToken = async () => {
        try {
            const response = await axios.get('/apisirs6v2/token')
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
        } catch (error) {
            if (error.response) {
                navigate('/')
            }
        }
    }

    const axiosJWT = axios.create()
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date()
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('/apisirs6v2/token')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    const getProvinsi = async() => {
        try {
            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            const results = await axiosJWT.get('/apisirs6v2/provinsi',
                customConfig)

            const daftarProvinsi = results.data.data.map((value) => {
                return value
            })

            setDaftarProvinsi(daftarProvinsi)
        } catch (error) {
            console.log(error)
        }
    }

    const getKabKota = async(provinsiId) => {
        try {
            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    provinsiId: provinsiId
                }
            }
            const results = await axiosJWT.get('/apisirs6v2/kabkota',
                customConfig)

            const daftarKabKota = results.data.data.map((value) => {
                return value
            })

            setDaftarKabKota(daftarKabKota)
        } catch (error) {
            console.log(error)
        }
    }

    const provinsiChangeHandler = (e) => {
        const provinsiId = e.target.value
        setProvinsiId(provinsiId)
        getKabKota(provinsiId)
    }

    const kabKotaChangeHandler = (e) => {
        const kabKotaId = e.target.value
        setKabKotaId(kabKotaId)
    }

    const changeHandlerNamaRs = (event) => {
        setNamaRS(event.target.value)
    }

    const Cari = async (e) => {
        e.preventDefault()
        const parameterAbsensi = new Object()

        if (provinsiId != null) {
            parameterAbsensi.provinsiId = provinsiId
        }
    
        if (kabKotaId !== null && kabKotaId !== '0' ) {
            parameterAbsensi.kabKotaId = kabKotaId
        }

        if (namaRS !== '' ) {
            parameterAbsensi.namaRS = namaRS
        }

        console.log(parameterAbsensi)

        try {
            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: parameterAbsensi
            }
            const results = await axiosJWT.get('/apisirs6v2/absensi',
                customConfig)
            const dataAbsensiDetail = results.data.data.map((value) => {
                return value
            })
            setDataAbsensi(dataAbsensiDetail)
            console.log(results)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container" style={{ marginTop: "70px" }}>
            <form onSubmit={ Cari}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="form-floating" style={{ width: "100%", paddingBottom: "5px"}}>
                                    <select
                                        name="provinsi"
                                        id="provinsi"
                                        typeof="select"
                                        className="form-select"
                                        onChange={e => provinsiChangeHandler(e)}
                                        >
                                        <option key={0} value={0}>Pilih</option>
                                        {daftarProvinsi.map((nilai) => {
                                            return (
                                            <option
                                                key={nilai.id}
                                                value={nilai.id}
                                            >
                                                {nilai.nama}
                                            </option>
                                            );
                                        })}
                                    </select>
                                    <label htmlFor="provinsi">Provinsi</label>
                                </div>

                                <div className="form-floating" style={{ width: "100%", paddingBottom: "5px"}}>
                                    <select
                                        name="kabKota"
                                        id="kabKota"
                                        typeof="select"
                                        className="form-select"
                                        onChange={e => kabKotaChangeHandler(e)}
                                        >
                                        <option key={0} value={0}>Pilih</option>
                                        {daftarKabKota.map((nilai) => {
                                            return (
                                            <option
                                                key={nilai.id}
                                                value={nilai.id}
                                            >
                                                {nilai.nama}
                                            </option>
                                            );
                                        })}
                                    </select>
                                    <label htmlFor="kabKota">Kab/Kota</label>
                                </div>

                                <div className="form-floating" style={{ width: "100%", paddingBottom: "5px"}}>
                                    <input type="text" name="namaRS" className="form-control"
                                        value={namaRS} onChange={e => changeHandlerNamaRs(e)} disabled={false}/>
                                    <label htmlFor="namaRS">Nama RS</label>
                                </div>

                                <div className="mt-1">
                                    <button type="submit" className="btn btn-outline-success" ><HiSaveAs/> Cari</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className="row mt-3">
                <div className="col-md-12">
                <div className="table-container mt-3 mb-3">
                <table>
                        <thead>
                        <tr className="main-header-row">
                                <th className="sticky-header" rowSpan="2" style={{ "width": "60px" }} >No.</th>
                                <th className="sticky-header" rowSpan="2" style={{ "width": "250px" }}>Nama RS</th>
                                {/* <th rowSpan="2" className={style.myTableTH} style={{ "width": "1%" }}>RL 3.2</th> */}
                                <th colSpan="12">RL 3.1</th>
                                <th colSpan="12">RL 3.2</th>
                                <th colSpan="12">RL 3.3</th>
                                <th colSpan="12">RL 3.4</th>
                                <th colSpan="12">RL 3.5</th>
                                <th colSpan="12">RL 3.6</th>
                                <th colSpan="12">RL 3.7</th>
                                <th colSpan="12">RL 3.8</th>
                                <th colSpan="12">RL 3.9</th>
                                <th colSpan="12">RL 3.10</th>
                                
                                <th rowSpan="2" className={style.myTableTH} style={{ "width": "0.5%" }}>RL 3.11</th>
                                <th rowSpan="2" className={style.myTableTH} style={{ "width": "0.5%" }}>RL 3.12</th>
                                <th rowSpan="2" className={style.myTableTH} style={{ "width": "0.5%" }}>RL 3.13</th>
                                <th rowSpan="2" className={style.myTableTH} style={{ "width": "0.5%" }}>RL 3.14</th>
                                <th rowSpan="2" className={style.myTableTH} style={{ "width": "0.5%" }}>RL 3.15</th>
                                <th rowSpan="2" className={style.myTableTH} style={{ "width": "0.5%" }}>RL 3.16</th>
                                <th rowSpan="2" className={style.myTableTH} style={{ "width": "0.5%" }}>RL 3.17</th>
                                <th rowSpan="2" className={style.myTableTH} style={{ "width": "0.5%" }}>RL 3.18</th>
                                <th rowSpan="2" className={style.myTableTH} style={{ "width": "0.5%" }}>RL 3.19</th>
                                
                                <th colSpan="12">RL 4.1</th>
                                <th colSpan="12">RL 4.2</th>
                                <th colSpan="12">RL 4.3</th>
                                <th colSpan="12">RL 5.1</th>
                                <th colSpan="12">RL 5.2</th>
                                <th colSpan="12">RL 5.3</th>
                            </tr>
                            <tr className="subheader-row">
                            <th style={{ "width": "200px" }} className="sticky-column">1</th>
                            <th style={{ "width": "50px" }} className="sticky-column">2</th>
                            <th style={{ "width": "50px" }}>3</th>
                            <th style={{ "width": "50px" }}>4</th>
                            <th style={{ "width": "50px" }}>5</th>
                            <th style={{ "width": "50px" }}>6</th>
                            <th style={{ "width": "50px" }}>7</th>
                            <th style={{ "width": "50px" }}>8</th>
                            <th style={{ "width": "50px" }}>9</th>
                            <th style={{ "width": "50px" }}>10</th>
                            <th style={{ "width": "50px" }}>11</th>
                            <th style={{ "width": "50px" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                {/* rl 4 dan 5  */}
                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>

                                <th className={style.myTableTH} style={{ "width": "1%" }}>1</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>2</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>3</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>4</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>5</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>6</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>7</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>8</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>9</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>10</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>11</th>
                                <th className={style.myTableTH} style={{ "width": "1%" }}>12</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {dataAbsensi.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="sticky-column" style={{textAlign: 'right', verticalAlign: 'middle'}}>{index + 1}</td>
                                        <td className="sticky-column">{value.nama_rs}</td>
                                        {/* <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_317 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td> */}

                                        {/* RL 5.3 */}
                                        {/* <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td> */}

                                    {/* 3.1 */}
                                    <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.2 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_32_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.3 */}

                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.4 */}

                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.5 */}

                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.6 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.7 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_37_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.8 */}

                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.9 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_39_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.10 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        
                                        {/* 3.11 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_317 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 3.12 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_317 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        
                                        {/* 3.13 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_317 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        
                                        {/* 3.14 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_317 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        
                                        {/* 3.15 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_317 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        
                                        {/* 3.16 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_317 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        
                                        {/* 3.17 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_317 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        
                                        {/* 3.18 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_318 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        
                                        {/* 3.19 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_317 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        
                                        {/* 4.1 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 4.2 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        
                                        {/* 4.3 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 5.1 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 5.2 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_52_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {/* 5.3 */}
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_1 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_2 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_3 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_4 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_5 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_6 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_7 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_8 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_9 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_10 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_11 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {
                                                value.rl_53_bulan_12 === 0 ? (
                                                    <div>
                                                        <img
                                                            src={silangIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <img
                                                            src={checkIcon}
                                                            className="img-fluid"
                                                            style={{width:'20px', height: 'auto'}}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>




                                        
                                        
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    </div>
                    
                </div>
            </div>
        </div>
    )


}

export default Absensi