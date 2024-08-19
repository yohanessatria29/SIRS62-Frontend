import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL35.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner'

const FormTambahRL35 = () => {
    const [tahun, setTahun] = useState('')
    const [bulan, setBulan] = useState('01')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const [buttonStatus, setButtonStatus] = useState(false)
    const [spinner, setSpinner]= useState(false)

    useEffect(() => {
        refreshToken()
        getRLTigaTitikLimaTemplate()
        const date = new Date();
        setTahun(date.getFullYear())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const refreshToken = async() => {
        try {
            const response = await axios.get('/apisirs6v2/token')
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
            getDataRS(decoded.satKerId)
        } catch (error) {
            if(error.response) {
                navigate('/')
            }
        }
    }

    const axiosJWT = axios.create()
    axiosJWT.interceptors.request.use(async(config) => {
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

    const getDataRS = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs6v2/rumahsakit/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setNamaRS(response.data.data.nama)
            setAlamatRS(response.data.data.alamat)
            setNamaPropinsi(response.data.data.provinsi_nama)
            setNamaKabKota(response.data.data.kab_kota_nama)
        } catch (error) {
            
        }
    }

    const getRLTigaTitikLimaTemplate = async() => {
        setSpinner(true)
        try {
            const response = await axiosJWT.get('/apisirs6v2/jeniskegiatanrltigatitiklima', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    no: value.no,
                    jenisKegiatan: value.nama,
                    kunjungan_pasien_dalam_kabkota: 0,
                    kunjungan_pasien_luar_kabkota: 0,
                    total_kunjungan: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
            setSpinner(false)
        } catch (error) {
            
        }
    }

    const changeHandlerSingle = (event) => {
        const name = event.target.name
        if (name === 'tahun') {
            setTahun(parseInt(event.target.value))
        } else if (name === 'bulan') {
            setBulan(parseInt(event.target.value))
        }
    }

    const changeHandler = (event, index) => {
        let newDataRL = [...dataRL]
        const name = event.target.name
        if (name === 'check') {
            if (event.target.checked === true) {
                newDataRL[index].disabledInput = false
            } else if (event.target.checked === false) {
                newDataRL[index].disabledInput = true
            }
            newDataRL[index].checked = event.target.checked
        } else if (name === 'kunjungan_pasien_dalam_kabkota') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kunjungan_pasien_dalam_kabkota = parseInt(event.target.value)
            newDataRL[index].total_kunjungan = parseInt(event.target.value) + parseInt(dataRL[index].kunjungan_pasien_luar_kabkota)
        }  else if (name === 'kunjungan_pasien_luar_kabkota') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kunjungan_pasien_luar_kabkota = parseInt(event.target.value)
            newDataRL[index].total_kunjungan = parseInt(event.target.value) + parseInt(dataRL[index].kunjungan_pasien_dalam_kabkota)
        }
        
        setDataRL(newDataRL)

        let jumlahDataRL = [...dataRL]

        jumlahDataRL[30].kunjungan_pasien_dalam_kabkota = (
            parseInt(dataRL[0].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[1].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[2].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[3].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[4].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[5].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[6].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[7].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[8].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[9].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[10].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[11].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[12].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[13].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[14].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[15].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[16].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[17].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[18].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[19].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[20].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[21].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[22].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[23].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[24].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[25].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[26].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[27].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[28].kunjungan_pasien_dalam_kabkota) +
            parseInt(dataRL[29].kunjungan_pasien_dalam_kabkota)
        )

        jumlahDataRL[30].kunjungan_pasien_luar_kabkota = (
            parseInt(dataRL[0].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[1].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[2].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[3].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[4].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[5].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[6].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[7].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[8].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[9].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[10].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[11].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[12].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[13].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[14].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[15].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[16].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[17].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[18].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[19].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[20].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[21].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[22].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[23].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[24].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[25].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[26].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[27].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[28].kunjungan_pasien_luar_kabkota) +
            parseInt(dataRL[29].kunjungan_pasien_luar_kabkota)
        )

        jumlahDataRL[30].total_kunjungan = (
            parseInt(dataRL[0].total_kunjungan) +
            parseInt(dataRL[1].total_kunjungan) +
            parseInt(dataRL[2].total_kunjungan) +
            parseInt(dataRL[3].total_kunjungan) +
            parseInt(dataRL[4].total_kunjungan) +
            parseInt(dataRL[5].total_kunjungan) +
            parseInt(dataRL[6].total_kunjungan) +
            parseInt(dataRL[7].total_kunjungan) +
            parseInt(dataRL[8].total_kunjungan) +
            parseInt(dataRL[9].total_kunjungan) +
            parseInt(dataRL[10].total_kunjungan) +
            parseInt(dataRL[11].total_kunjungan) +
            parseInt(dataRL[12].total_kunjungan) +
            parseInt(dataRL[13].total_kunjungan) +
            parseInt(dataRL[14].total_kunjungan) +
            parseInt(dataRL[15].total_kunjungan) +
            parseInt(dataRL[16].total_kunjungan) +
            parseInt(dataRL[17].total_kunjungan) +
            parseInt(dataRL[18].total_kunjungan) +
            parseInt(dataRL[19].total_kunjungan) +
            parseInt(dataRL[20].total_kunjungan) +
            parseInt(dataRL[21].total_kunjungan) +
            parseInt(dataRL[22].total_kunjungan) +
            parseInt(dataRL[23].total_kunjungan) +
            parseInt(dataRL[24].total_kunjungan) +
            parseInt(dataRL[25].total_kunjungan) +
            parseInt(dataRL[26].total_kunjungan) +
            parseInt(dataRL[27].total_kunjungan) +
            parseInt(dataRL[28].total_kunjungan) +
            parseInt(dataRL[29].total_kunjungan)
        )

        setDataRL(jumlahDataRL)

        // let RataRataDataRL = [...dataRL]

        // RataRataDataRL[32].kunjungan_pasien_dalam_kabkota = (
        //     parseInt(dataRL[31].kunjungan_pasien_dalam_kabkota) / parseInt(dataRL[30].kunjungan_pasien_dalam_kabkota)
        // )

        // RataRataDataRL[32].kunjungan_pasien_luar_kabkota = (
        //     parseInt(dataRL[31].kunjungan_pasien_luar_kabkota) / parseInt(dataRL[30].kunjungan_pasien_luar_kabkota)
        // )

        // RataRataDataRL[32].total_kunjungan = (
        //     parseInt(dataRL[31].total_kunjungan) / parseInt(dataRL[30].total_kunjungan)
        // )
        // setDataRL(RataRataDataRL)
    }

    const Simpan = async (e) => {
        let date = (tahun+'-'+bulan+'-01');
        e.preventDefault()
        setSpinner(true)
        setButtonStatus(true)
        try {
            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                return {
                    "jenisKegiatanId": value.id,
                    "kunjungan_pasien_dalam_kabkota": value.kunjungan_pasien_dalam_kabkota,
                    "kunjungan_pasien_luar_kabkota": value.kunjungan_pasien_luar_kabkota,
                    "total_kunjungan": value.total_kunjungan
                }
            })

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            await axiosJWT.post('/apisirs6v2/rltigatitiklima',{
                tahun: parseInt(tahun),
                tahunDanBulan : date,
                data: dataRLArray
            }, customConfig)
            // console.log(result.data)
            setSpinner(false)
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl35')
            }, 1000);
        } catch (error) {
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
            setSpinner(false)
        }
    }

    const preventPasteNegative= (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = parseFloat(clipboardData.getData('text'));

        if(pastedData <0){
            e.preventDefault();
        }
    }

    const preventMinus = (e) => {
        if(e.code === 'Minus'){
            e.preventDefault();
        }
    }

    const handleFocus = ((event) => {
        event.target.select()
    })

    const maxLengthCheck = (object) => {
        if (object.target.value.length > object.target.maxLength) {
            object.target.value = object.target.value.slice(0, object.target.maxLength)
        }
    }

    return (
        <div className="container" style={{marginTop: "70px"}}>
            <form onSubmit={Simpan}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Profile Fasyankes</h5>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="nama"
                                        value={ namaRS } disabled={true}/>
                                    <label htmlFor="nama">Nama</label>
                                </div>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="alamat"
                                        value={ alamatRS} disabled={true}/>
                                    <label htmlFor="alamat">Alamat</label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="provinsi"
                                        value={ namaPropinsi } disabled={true}/>
                                    <label htmlFor="provinsi">Provinsi </label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="kabkota"
                                        value= { namaKabKota } disabled={true}/>
                                    <label htmlFor="kabkota">Kab/Kota</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Periode Laporan</h5>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                <input name="tahun" type="number" className="form-control" id="floatingInput" min="2024"
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)}/>
                                </div>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <select name="bulan" className="form-control" id="bulan" onChange={e => changeHandlerSingle(e)}>
                                        <option value="01">Januari</option>
                                        <option value="02">Februari</option>
                                        <option value="03">Maret</option>
                                        <option value="04">April</option>
                                        <option value="05">Mei</option>
                                        <option value="06">Juni</option>
                                        <option value="07">Juli</option>
                                        <option value="08">Agustus</option>
                                        <option value="09">September</option>
                                        <option value="10">Oktober</option>
                                        <option value="11">November</option>
                                        <option value="12">Desember</option>
                                    </select>
                                    <label htmlFor="bulan">Bulan</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl35/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span>
                            <span style={{color:"gray"}}>Tambah data RL 3.5 -  Kunjungan Rawat Jalan</span> */}
                            &lt;
                        </Link> 
                        <span style={{color:"gray"}}>Kembali RL 3.5 -  Kunjungan</span>
                        <div className="container" style={{ textAlign: "center" }}>
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        </div>
                        <table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{"width": "5%"}}>No.</th>
                                    <th style={{"width": "3%"}}></th>
                                    <th style={{"width": "40%"}}>Jenis Kegiatan</th>
                                    <th>Kunjungan Pasien Dalam Kota</th>
                                    <th>Kunjungan Pasien Luar Kota</th>
                                    <th>Total Kunjungan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    let disabled = true
                                    let visibled = true
                                    if(value.no == 99){
                                        disabled = true
                                        visibled = "none" 
                                    }else if(value.no == 0){
                                        value.disabledInput = true
                                        disabled = false
                                        visibled = "block"
                                    } else {
                                        disabled = false
                                        visibled = "block"
                                    }
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                                <input type='hidden' name='id' className="form-control" value={value.id} disabled={true}/>
                                                <input type='text' name='no' className="form-control" value={value.no} disabled={true}/>
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked} disabled={disabled} style={{display: visibled}}/>
                                            </td>
                                            <td>
                                                <input type="text" name="jenisKegiatan" className="form-control" value={value.jenisKegiatan} disabled={true} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="kunjungan_pasien_dalam_kabkota" className="form-control" value={value.kunjungan_pasien_dalam_kabkota} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="kunjungan_pasien_luar_kabkota" className="form-control" value={value.kunjungan_pasien_luar_kabkota} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="total_kunjungan" className="form-control" value={value.total_kunjungan} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <ToastContainer />
                    <button type="submit" disabled={buttonStatus} className="btn btn-outline-success"><HiSaveAs/> Simpan</button>
                </div>
            </form>
        </div>
    )
}

export default FormTambahRL35