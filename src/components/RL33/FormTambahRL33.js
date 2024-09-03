import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import style from "./FormTambahRL33.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import "react-toastify/dist/ReactToastify.css";

const FormTambahRL33 = () => {
  const [tahun, setTahun] = useState("");
  const [bulan, setBulan] = useState("");
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getRLTigaTitikTigaTemplate();
    const date = new Date();
    setTahun(date.getFullYear());
    setBulan(date.getMonth() + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const refreshToken = async () => {
    try {
      const response = await axios.get("/apisirs6v2/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      getDataRS(decoded.satKerId);
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

  const getDataRS = async (id) => {
    try {
      const response = await axiosJWT.get("/apisirs6v2/rumahsakit/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(id);
      setNamaRS(response.data.data.nama);
      setAlamatRS(response.data.data.alamat);
      setNamaPropinsi(response.data.data.provinsi_nama);
      setNamaKabKota(response.data.data.kab_kota_nama);
    } catch (error) {}
  };

  const getRLTigaTitikTigaTemplate = async () => {
    try {
      const response = await axiosJWT.get(
        "/apisirs6v2/jenispelayanantigatitiktiga",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const rlTemplate = response.data.data
        .filter((value) => {
          return value.no !== "1" && value.no !== "2";
        })
        .map((value, index) => {
          return {
            id: value.id,
            no: value.no,
            jenisPelayanan: value.nama,
            total_pasien_rujukan: 0,
            total_pasien_non_rujukan: 0,
            tlp_dirawat: 0,
            tlp_dirujuk: 0,
            tlp_pulang: 0,
            m_igd_laki: 0,
            m_igd_perempuan: 0,
            doa_laki: 0,
            doa_perempuan: 0,
            luka_laki: 0,
            luka_perempuan: 0,
            false_emergency: 0,
            disabledInput: true,
            checked: false,
          };
        });
      setDataRL(rlTemplate);
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
    } else if (name === "total_pasien_rujukan") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].total_pasien_rujukan = event.target.value;
      newDataRL[index].tlp_dirawat =
        parseInt(event.target.value) +
        parseInt(newDataRL[index].total_pasien_non_rujukan) -
        (parseInt(newDataRL[index].tlp_dirujuk) +
          parseInt(newDataRL[index].tlp_pulang) +
          parseInt(newDataRL[index].m_igd_laki) +
          parseInt(newDataRL[index].m_igd_perempuan) +
          parseInt(newDataRL[index].doa_laki) +
          parseInt(newDataRL[index].doa_perempuan));
    } else if (name === "total_pasien_non_rujukan") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].total_pasien_non_rujukan = event.target.value;
      newDataRL[index].tlp_dirawat =
        parseInt(event.target.value) +
        parseInt(newDataRL[index].total_pasien_rujukan) -
        (parseInt(newDataRL[index].tlp_dirujuk) +
          parseInt(newDataRL[index].tlp_pulang) +
          parseInt(newDataRL[index].m_igd_laki) +
          parseInt(newDataRL[index].m_igd_perempuan) +
          parseInt(newDataRL[index].doa_laki) +
          parseInt(newDataRL[index].doa_perempuan));
      // } else if (name === "tlp_dirawat") {
      //   if (event.target.value === "") {
      //     event.target.value = 0;
      //     event.target.select(event.target.value);
      //   }
      //   newDataRL[index].tlp_dirawat = event.target.value;
    } else if (name === "tlp_dirujuk") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].tlp_dirujuk = event.target.value;
      newDataRL[index].tlp_dirawat =
        parseInt(newDataRL[index].total_pasien_non_rujukan) +
        parseInt(newDataRL[index].total_pasien_rujukan) -
        (parseInt(newDataRL[index].tlp_pulang) +
          parseInt(event.target.value) +
          parseInt(newDataRL[index].m_igd_laki) +
          parseInt(newDataRL[index].m_igd_perempuan) +
          parseInt(newDataRL[index].doa_laki) +
          parseInt(newDataRL[index].doa_perempuan));
    } else if (name === "tlp_pulang") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].tlp_pulang = event.target.value;
      newDataRL[index].tlp_dirawat =
        parseInt(newDataRL[index].total_pasien_non_rujukan) +
        parseInt(newDataRL[index].total_pasien_rujukan) -
        (parseInt(newDataRL[index].tlp_dirujuk) +
          parseInt(event.target.value) +
          parseInt(newDataRL[index].m_igd_laki) +
          parseInt(newDataRL[index].m_igd_perempuan) +
          parseInt(newDataRL[index].doa_laki) +
          parseInt(newDataRL[index].doa_perempuan));
    } else if (name === "m_igd_laki") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].m_igd_laki = event.target.value;
      newDataRL[index].tlp_dirawat =
        parseInt(newDataRL[index].total_pasien_non_rujukan) +
        parseInt(newDataRL[index].total_pasien_rujukan) -
        (parseInt(newDataRL[index].tlp_dirujuk) +
          parseInt(event.target.value) +
          parseInt(newDataRL[index].tlp_pulang) +
          parseInt(newDataRL[index].m_igd_perempuan) +
          parseInt(newDataRL[index].doa_laki) +
          parseInt(newDataRL[index].doa_perempuan));
    } else if (name === "m_igd_perempuan") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].m_igd_perempuan = event.target.value;
      newDataRL[index].tlp_dirawat =
        parseInt(newDataRL[index].total_pasien_non_rujukan) +
        parseInt(newDataRL[index].total_pasien_rujukan) -
        (parseInt(newDataRL[index].tlp_dirujuk) +
          parseInt(event.target.value) +
          parseInt(newDataRL[index].m_igd_laki) +
          parseInt(newDataRL[index].tlp_pulang) +
          parseInt(newDataRL[index].doa_laki) +
          parseInt(newDataRL[index].doa_perempuan));
    } else if (name === "doa_laki") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].doa_laki = event.target.value;
      newDataRL[index].tlp_dirawat =
        parseInt(newDataRL[index].total_pasien_non_rujukan) +
        parseInt(newDataRL[index].total_pasien_rujukan) -
        (parseInt(newDataRL[index].tlp_dirujuk) +
          parseInt(event.target.value) +
          parseInt(newDataRL[index].m_igd_laki) +
          parseInt(newDataRL[index].m_igd_perempuan) +
          parseInt(newDataRL[index].tlp_pulang) +
          parseInt(newDataRL[index].doa_perempuan));
    } else if (name === "doa_perempuan") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].doa_perempuan = event.target.value;
      newDataRL[index].tlp_dirawat =
        parseInt(newDataRL[index].total_pasien_non_rujukan) +
        parseInt(newDataRL[index].total_pasien_rujukan) -
        (parseInt(newDataRL[index].tlp_dirujuk) +
          parseInt(event.target.value) +
          parseInt(newDataRL[index].m_igd_laki) +
          parseInt(newDataRL[index].m_igd_perempuan) +
          parseInt(newDataRL[index].doa_laki) +
          parseInt(newDataRL[index].tlp_pulang));
    } else if (name === "luka_laki") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].luka_laki = event.target.value;
    } else if (name === "luka_perempuan") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].luka_perempuan = event.target.value;
    } else if (name === "false_emergency") {
      if (event.target.value === "") {
        event.target.value = 0;
        event.target.select(event.target.value);
      }
      newDataRL[index].false_emergency = event.target.value;
    }

    setDataRL(newDataRL);
  };

  const Simpan = async (e) => {
    e.preventDefault();
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const dataRLArray = dataRL
        .filter((value) => {
          return value.checked === true;
        })
        .map((value, index) => {
          return {
            jenisPelayananTigaTitikTigaId: parseInt(value.id),
            total_pasien_rujukan: parseInt(value.total_pasien_rujukan),
            total_pasien_non_rujukan: parseInt(value.total_pasien_non_rujukan),
            tlp_dirawat: parseInt(value.tlp_dirawat),
            tlp_dirujuk: parseInt(value.tlp_dirujuk),
            tlp_pulang: parseInt(value.tlp_pulang),
            m_igd_laki: parseInt(value.m_igd_laki),
            m_igd_perempuan: parseInt(value.m_igd_perempuan),
            doa_laki: parseInt(value.doa_laki),
            doa_perempuan: parseInt(value.doa_perempuan),
            luka_laki: parseInt(value.luka_laki),
            luka_perempuan: parseInt(value.luka_perempuan),
            false_emergency: parseInt(value.false_emergency),
          };
        });

      let igdData = {
        total_pasien_rujukan: 0,
        total_pasien_non_rujukan: 0,
        tlp_dirawat: 0,
        tlp_dirujuk: 0,
        tlp_pulang: 0,
        m_igd_laki: 0,
        m_igd_perempuan: 0,
        doa_laki: 0,
        doa_perempuan: 0,
        luka_laki: 0,
        luka_perempuan: 0,
        false_emergency: 0,
      };

      const getIgdData = await axiosJWT.get(
        "/apisirs6v2/cekrltigatitiktigadetail",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            tahun: parseInt(tahun),
            bulan: parseInt(bulan),
            specificId: 1,
          },
        }
      );

      dataRL
        .filter((value) => {
          return value.checked === true && value.no.includes("1.");
        })
        .map((value, index) => {
          igdData.total_pasien_rujukan += parseInt(value.total_pasien_rujukan);
          igdData.total_pasien_non_rujukan += parseInt(
            value.total_pasien_non_rujukan
          );
          igdData.tlp_dirawat += parseInt(value.tlp_dirawat);
          igdData.tlp_dirujuk += parseInt(value.tlp_dirujuk);
          igdData.tlp_pulang += parseInt(value.tlp_pulang);
          igdData.m_igd_laki += parseInt(value.m_igd_laki);
          igdData.m_igd_perempuan += parseInt(value.m_igd_perempuan);
          igdData.doa_laki += parseInt(value.doa_laki);
          igdData.doa_perempuan += parseInt(value.doa_perempuan);
          igdData.luka_laki += parseInt(value.luka_laki);
          igdData.luka_perempuan += parseInt(value.luka_perempuan);
          igdData.false_emergency += parseInt(value.false_emergency);
        });

      if (getIgdData.data.data != null) {
        igdData.total_pasien_rujukan += parseInt(
          getIgdData.data.data.total_pasien_rujukan
        );
        igdData.total_pasien_non_rujukan += parseInt(
          getIgdData.data.data.total_pasien_non_rujukan
        );
        igdData.tlp_dirawat += parseInt(getIgdData.data.data.tlp_dirawat);
        igdData.tlp_dirujuk += parseInt(getIgdData.data.data.tlp_dirujuk);
        igdData.tlp_pulang += parseInt(getIgdData.data.data.tlp_pulang);
        igdData.m_igd_laki += parseInt(getIgdData.data.data.m_igd_laki);
        igdData.m_igd_perempuan += parseInt(
          getIgdData.data.data.m_igd_perempuan
        );
        igdData.doa_laki += parseInt(getIgdData.data.data.doa_laki);
        igdData.doa_perempuan += parseInt(getIgdData.data.data.doa_perempuan);
        igdData.luka_laki += parseInt(getIgdData.data.data.luka_laki);
        igdData.luka_perempuan += parseInt(getIgdData.data.data.luka_perempuan);
        igdData.false_emergency += parseInt(
          getIgdData.data.data.false_emergency
        );

        await axiosJWT.patch(
          "/apisirs6v2/rltigatitiktigadetail/" + getIgdData.data.data.id,
          igdData,
          customConfig
        );
      } else {
        igdData.jenisPelayananTigaTitikTigaId = 1;
        dataRLArray.push(igdData);
      }
      // console.log(getIgdData);
      // console.log(igdData);

      let nonBedahData = {
        total_pasien_rujukan: 0,
        total_pasien_non_rujukan: 0,
        tlp_dirawat: 0,
        tlp_dirujuk: 0,
        tlp_pulang: 0,
        m_igd_laki: 0,
        m_igd_perempuan: 0,
        doa_laki: 0,
        doa_perempuan: 0,
        luka_laki: 0,
        luka_perempuan: 0,
        false_emergency: 0,
      };

      const getNonBedahData = await axiosJWT.get(
        "/apisirs6v2/cekrltigatitiktigadetail",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            tahun: parseInt(tahun),
            bulan: parseInt(bulan),
            specificId: 6,
          },
        }
      );

      dataRL
        .filter((value) => {
          return value.checked === true && value.no.includes("2.");
        })
        .map((value, index) => {
          nonBedahData.total_pasien_rujukan += parseInt(
            value.total_pasien_rujukan
          );
          nonBedahData.total_pasien_non_rujukan += parseInt(
            value.total_pasien_non_rujukan
          );
          nonBedahData.tlp_dirawat += parseInt(value.tlp_dirawat);
          nonBedahData.tlp_dirujuk += parseInt(value.tlp_dirujuk);
          nonBedahData.tlp_pulang += parseInt(value.tlp_pulang);
          nonBedahData.m_igd_laki += parseInt(value.m_igd_laki);
          nonBedahData.m_igd_perempuan += parseInt(value.m_igd_perempuan);
          nonBedahData.doa_laki += parseInt(value.doa_laki);
          nonBedahData.doa_perempuan += parseInt(value.doa_perempuan);
          nonBedahData.luka_laki += parseInt(value.luka_laki);
          nonBedahData.luka_perempuan += parseInt(value.luka_perempuan);
          nonBedahData.false_emergency += parseInt(value.false_emergency);
        });

      if (getNonBedahData.data.data != null) {
        nonBedahData.total_pasien_rujukan += parseInt(
          getNonBedahData.data.data.total_pasien_rujukan
        );
        nonBedahData.total_pasien_non_rujukan += parseInt(
          getNonBedahData.data.data.total_pasien_non_rujukan
        );
        nonBedahData.tlp_dirawat += parseInt(
          getNonBedahData.data.data.tlp_dirawat
        );
        nonBedahData.tlp_dirujuk += parseInt(
          getNonBedahData.data.data.tlp_dirujuk
        );
        nonBedahData.tlp_pulang += parseInt(
          getNonBedahData.data.data.tlp_pulang
        );
        nonBedahData.m_igd_laki += parseInt(
          getNonBedahData.data.data.m_igd_laki
        );
        nonBedahData.m_igd_perempuan += parseInt(
          getNonBedahData.data.data.m_igd_perempuan
        );
        nonBedahData.doa_laki += parseInt(getNonBedahData.data.data.doa_laki);
        nonBedahData.doa_perempuan += parseInt(
          getNonBedahData.data.data.doa_perempuan
        );
        nonBedahData.luka_laki += parseInt(getNonBedahData.data.data.luka_laki);
        nonBedahData.luka_perempuan += parseInt(
          getNonBedahData.data.data.luka_perempuan
        );
        nonBedahData.false_emergency += parseInt(
          getNonBedahData.data.data.false_emergency
        );

        await axiosJWT.patch(
          "/apisirs6v2/rltigatitiktigadetail/" + getNonBedahData.data.data.id,
          nonBedahData,
          customConfig
        );
      } else {
        nonBedahData.jenisPelayananTigaTitikTigaId = 6;
        dataRLArray.push(nonBedahData);
      }
      // console.log(getNonBedahData);
      // console.log(nonBedahData);
      // console.log(dataRLArray);
      const result = await axiosJWT.post(
        "/apisirs6v2/rltigatitiktiga",
        {
          tahun: parseInt(tahun),
          bulan: parseInt(bulan),
          data: dataRLArray,
        },
        customConfig
      );

      if (result.status === 201) {
        toast("Data Berhasil Disimpan", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          navigate("/rl33");
        }, 2000);
      } else {
        toast(`Data Gagal Disimpan, ${result.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
      toast(
        `Data tidak bisa disimpan karena ,${error.response.data.message.name}`,
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
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
                <h5 className="card-title h5">Profil Fasyankes</h5>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    value={namaRS}
                    disabled={true}
                  />
                  <label>Nama</label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    value={alamatRS}
                    disabled={true}
                  />
                  <label>Alamat</label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "50%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    value={namaPropinsi}
                    disabled={true}
                  />
                  <label>Provinsi</label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "50%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    value={namaKabKota}
                    disabled={true}
                  />
                  <label>Kab/Kota</label>
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
                  style={{ width: "50%", display: "inline-block" }}
                >
                  <select
                    name="bulan"
                    className="form-control"
                    id="bulan"
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                  >
                    {months.map((value) => (
                      <option key={value.value - 1} value={value.value}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="bulan">Bulan</label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "50%", display: "inline-block" }}
                >
                  <input
                    name="tahun"
                    type="number"
                    className="form-control"
                    id="tahun"
                    placeholder="Tahun"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    min="0"
                    maxLength={4}
                    onInput={(e) => maxLengthCheck(e)}
                    onPaste={preventPasteNegative}
                  />
                  <label htmlFor="tahun">Tahun</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            <Link
              to={`/rl33/`}
              className="btn btn-info"
              style={{
                fontSize: "18px",
                backgroundColor: "#779D9E",
                color: "#FFFFFF",
              }}
            >
              &lt;
            </Link>
            <span style={{ color: "gray" }}>Kembali RL 3.3 Rawat Darurat</span>

            <Table
              className={style.rlTable}
              striped
              bordered
              responsive
              style={{ width: "200%" }}
            >
              <thead>
                <tr>
                  <th
                    style={{ width: "4%", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    No.
                  </th>
                  <th style={{ width: "3%" }} rowSpan={2}></th>
                  <th
                    style={{ width: "4%", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    No Pelayanan
                  </th>
                  <th
                    style={{ width: "20%", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    Jenis Pelayanan
                  </th>
                  <th colSpan={2}>Total Pasien</th>
                  <th colSpan={3}>Tindak Lanjut Pelayanan</th>
                  <th colSpan={2}>Mati di IGD</th>
                  <th colSpan={2}>DOA</th>
                  <th colSpan={2}>Luka-luka</th>
                  <th rowSpan={2} style={{ verticalAlign: "middle" }}>
                    False Emergency
                  </th>
                </tr>
                <tr>
                  <th>Rujukan</th>
                  <th>Non Rujukan</th>
                  <th>Dirawat</th>
                  <th>Dirujuk</th>
                  <th>Pulang</th>
                  <th style={{ width: "5%" }}>L</th>
                  <th style={{ width: "5%" }}>P</th>
                  <th style={{ width: "5%" }}>L</th>
                  <th style={{ width: "5%" }}>P</th>
                  <th style={{ width: "5%" }}>L</th>
                  <th style={{ width: "5%" }}>P</th>
                </tr>
              </thead>
              <tbody>
                {dataRL.map((value, index) => {
                  return (
                    <tr key={value.id}>
                      <td>
                        <input
                          type="text"
                          name="id"
                          className="form-control"
                          value={index + 1}
                          disabled={true}
                        />
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <input
                          type="checkbox"
                          name="check"
                          className="form-check-input"
                          onChange={(e) => changeHandler(e, index)}
                          checked={value.checked}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="no"
                          className="form-control"
                          value={value.no}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="jenisPelayanan"
                          className="form-control"
                          value={value.jenisPelayanan}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="total_pasien_rujukan"
                          className="form-control"
                          value={value.total_pasien_rujukan}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={value.disabledInput}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="total_pasien_non_rujukan"
                          className="form-control"
                          value={value.total_pasien_non_rujukan}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={value.disabledInput}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          // onInput={(e) => maxLengthCheck(e)}
                          // onPaste={preventPasteNegative}
                          name="tlp_dirawat"
                          className="form-control"
                          value={value.tlp_dirawat}
                          // onChange={(e) => changeHandler(e, index)}
                          // disabled={value.disabledInput}
                          readOnly={true}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="tlp_dirujuk"
                          className="form-control"
                          value={value.tlp_dirujuk}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={value.disabledInput}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="tlp_pulang"
                          className="form-control"
                          value={value.tlp_pulang}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={value.disabledInput}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="m_igd_laki"
                          className="form-control"
                          value={value.m_igd_laki}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={
                            value.no === "3" || value.no === "2.1"
                              ? true
                              : value.disabledInput
                          }
                          // readOnly={
                          //   value.no === "3" || value.no === "2.1"
                          //     ? true
                          //     : false
                          // }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="m_igd_perempuan"
                          className="form-control"
                          value={value.m_igd_perempuan}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={value.disabledInput}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="doa_laki"
                          className="form-control"
                          value={value.doa_laki}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={
                            value.no === "3" || value.no === "2.1"
                              ? true
                              : value.disabledInput
                          }
                          // readOnly={
                          //   value.no === "3" || value.no === "2.1"
                          //     ? true
                          //     : false
                          // }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="doa_perempuan"
                          className="form-control"
                          value={value.doa_perempuan}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={value.disabledInput}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="luka_laki"
                          className="form-control"
                          value={value.luka_laki}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={
                            value.no === "3" || value.no === "2.1"
                              ? true
                              : value.disabledInput
                          }
                          // readOnly={
                          //   value.no === "3" || value.no === "2.1"
                          //     ? true
                          //     : false
                          // }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="luka_perempuan"
                          className="form-control"
                          value={value.luka_perempuan}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={value.disabledInput}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          maxLength={7}
                          onInput={(e) => maxLengthCheck(e)}
                          onPaste={preventPasteNegative}
                          name="false_emergency"
                          className="form-control"
                          value={value.false_emergency}
                          onChange={(e) => changeHandler(e, index)}
                          disabled={value.no < 2 ? true : value.disabledInput}
                          // readOnly={value.no < 2 ? true : false}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
        <div className="mt-3 mb-3">
          <ToastContainer />
          <button type="submit" className="btn btn-outline-success">
            <HiSaveAs /> Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormTambahRL33;
