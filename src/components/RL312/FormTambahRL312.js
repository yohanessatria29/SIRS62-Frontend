import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import style from "./FormTambahRL312.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";

const FormTambahRL312 = () => {
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [tahun, setTahun] = useState("");
  const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [buttonStatus, setButtonStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getRLTigaTitikDuaBelasTemplate();
    const date = new Date();
    setTahun(date.getFullYear());
    // setTahun(date.getFullYear() - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("/apisirs6v2/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      getRumahSakit(decoded.satKerId);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("/apisirs6v2/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getRumahSakit = async (id) => {
    try {
      const response = await axiosJWT.get("/apisirs6v2/rumahsakit/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNamaRS(response.data.data.nama);
      setAlamatRS(response.data.data.alamat);
      setNamaPropinsi(response.data.data.provinsi_nama);
      setNamaKabKota(response.data.data.kab_kota_nama);
    } catch (error) {}
  };

  const getRLTigaTitikDuaBelasTemplate = async () => {
    // setSpinner(true);
    try {
      const response = await axiosJWT.get(
        "/apisirs6v2/spesialisasirltigatitikduabelas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const rlTemplate = response.data.data.map((value, index) => {
        return {
          id: value.id,
          jenisSpesialisasi: value.nama_spesialisasi,
          Khusus: 0,
          Besar: 0,
          Sedang: 0,
          Kecil: 0,
          disabledInput: true,
          checked: false,
        };
      });
      setDataRL(rlTemplate);
      // setSpinner(false);
    } catch (error) {}
  };

  const changeHandlerSingle = (event) => {
    setTahun(event.target.value);
  };

  const changeHandler = (event, index) => {
    let newDataRL = [...dataRL];
    const name = event.target.name;
    if (name === "check") {
      if (event.target.checked === true) {
        newDataRL[index].disabledInput = false;
      } else if (event.target.checked === false) {
        newDataRL[index].disabledInput = true;
      }
      newDataRL[index].checked = event.target.checked;
    } else if (name === "Khusus") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].Khusus = event.target.value;
    } else if (name === "Besar") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].Besar = event.target.value;
    } else if (name === "Sedang") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].Sedang = event.target.value;
    } else if (name === "Kecil") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].Kecil = event.target.value;
    }
    setDataRL(newDataRL);
  };

  const Simpan = async (e) => {
    e.preventDefault();
    setButtonStatus(true);
    try {
      const dataRLArray = dataRL
        .filter((value) => {
          return value.checked === true;
        })
        .map((value, index) => {
          return {
            SpesialisasiId: value.id,
            Khusus: parseInt(value.Khusus),
            Besar: parseInt(value.Besar),
            Sedang: parseInt(value.Sedang),
            Kecil: parseInt(value.Kecil),
          };
        });

      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axiosJWT.post(
        "/apisirs6v2/rltigatitikduabelas",
        {
          tahun: parseInt(tahun),
          data: dataRLArray,
        },
        customConfig
      );

      toast("Data Berhasil Disimpan", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        navigate("/rl312");
      }, 1000);
    } catch (error) {
      toast(`Gagal Simpan,${error.response.data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setButtonStatus(false);
    }
  };

  const preventPasteNegative = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = parseFloat(clipboardData.getData("text"));

    if (pastedData < 0) {
      e.preventDefault();
    }
  };

  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <form onSubmit={Simpan}>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title h5">Profile Fasyankes</h5>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="namaRS"
                    value={namaRS}
                    disabled={true}
                  />
                  <label htmlFor="namaRS">Nama</label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="alamatRS"
                    value={alamatRS}
                    disabled={true}
                  />
                  <label htmlFor="alamatRS">Alamat</label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "50%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="provinsiRS"
                    value={namaPropinsi}
                    disabled={true}
                  />
                  <label htmlFor="provinsiRS">Provinsi </label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "50%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="kabkotaRS"
                    value={namaKabKota}
                    disabled={true}
                  />
                  <label htmlFor="kabkotaRS">Kab/Kota</label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title h5">Periode Laporan</h5>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    name="tahun"
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Tahun"
                    value={tahun}
                    disabled
                    onChange={(e) => changeHandlerSingle(e)}
                  />
                  <label htmlFor="floatingInput">Tahun</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <Link
              to={`/rl312/`}
              className="btn btn-info"
              style={{
                fontSize: "18px",
                backgroundColor: "#779D9E",
                color: "#FFFFFF",
              }}
            >
              &lt;
            </Link>
            <span style={{ color: "gray" }}>Kembali RL 3.12 Pembedahan</span>

            <Table className={style.rlTable}>
              <thead>
                <tr>
                  <th style={{ width: "4%" }}>No.</th>
                  <th style={{ width: "3%" }}></th>
                  <th style={{ width: "20%" }}>Jenis Spesialisasi</th>
                  <th>Khusus</th>
                  <th>Besar</th>
                  <th>Sedang</th>
                  <th>Kecil</th>
                </tr>
              </thead>
              <tbody>
                {dataRL.map((value, index) => {
                  if (value.id === 88) {
                    return (
                      <tr key={value.id}>
                        <td>{value.id}</td>
                        <td>
                          <input
                            type="checkbox"
                            name="check"
                            className="checkbox"
                            onChange={(e) => changeHandler(e, index)}
                            checked={value.checked}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="jenisSpesialisasi"
                            className="form-control"
                            value={value.jenisSpesialisasi}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Khusus"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            className="form-control"
                            value={value.Khusus}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={true}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                            onFocus={handleFocus}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Besar"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            className="form-control"
                            value={value.Besar}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={true}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Sedang"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            className="form-control"
                            value={value.Sedang}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={true}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Kecil"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            className="form-control"
                            value={value.Kecil}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={true}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                          />
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={value.id}>
                        <td>{value.id}</td>
                        <td>
                          <input
                            type="checkbox"
                            name="check"
                            className="checkbox"
                            onChange={(e) => changeHandler(e, index)}
                            checked={value.checked}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="jenisSpesialisasi"
                            className="form-control"
                            value={value.jenisSpesialisasi}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Khusus"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            className="form-control"
                            value={value.Khusus}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={value.disabledInput}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                            onFocus={handleFocus}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Besar"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            className="form-control"
                            value={value.Besar}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={value.disabledInput}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Sedang"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            className="form-control"
                            value={value.Sedang}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={value.disabledInput}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Kecil"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            className="form-control"
                            value={value.Kecil}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={value.disabledInput}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                          />
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </Table>
            <div className="mt-3 mb-3">
              <ToastContainer />
              <button
                disabled={buttonStatus}
                type="submit"
                className="btn btn-outline-success"
              >
                <HiSaveAs /> Simpan
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormTambahRL312;
