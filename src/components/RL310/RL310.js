import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import style from "./FormTambahRL310.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const RL310 = () => {
  const [tahun, setTahun] = useState("");
  const [bulan, setBulan] = useState("");
  const [filterLabel, setFilterLabel] = useState([]);
  const [rumahSakit, setRumahSakit] = useState("");
  const [daftarRumahSakit, setDaftarRumahSakit] = useState([]);
  const [daftarProvinsi, setDaftarProvinsi] = useState([]);
  const [daftarKabKota, setDaftarKabKota] = useState([]);
  const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    const date = new Date();
    setTahun(date.getFullYear());
    setBulan(date.getMonth() + 1);
    // getDataRLTigaTitikSepuluh();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("/apisirs6v2/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      showRumahSakit(decoded.satKerId);
      setExpire(decoded.exp);
      setUser(decoded);
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

  const getRumahSakit = async (kabKotaId) => {
    try {
      const response = await axiosJWT.get("/apisirs6v2/rumahsakit/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          kabKotaId: kabKotaId,
        },
      });
      setDaftarRumahSakit(response.data.data);
    } catch (error) {}
  };

  const showRumahSakit = async (id) => {
    try {
      const response = await axiosJWT.get("/apisirs6v2/rumahsakit/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRumahSakit(response.data.data);
    } catch (error) {}
  };

  const getDataRLTigaTitikSepuluh = async (e) => {
    e.preventDefault();
    if (rumahSakit == null) {
      toast(`rumah sakit harus dipilih`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    const filter = [];
    filter.push("Nama: ".concat(rumahSakit.nama));
    filter.push(
      "Periode ".concat(
        String(months[bulan - 1].label)
          .concat(" ")
          .concat(tahun)
      )
    );
    setFilterLabel(filter);

    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          tahun: tahun,
          bulan: bulan,
        },
      };
      const results = await axiosJWT.get(
        "/apisirs6v2/rltigatitiksepuluh",
        customConfig
      );

      const rlTigaTitikSepuluhDetails = results.data.data.map((value) => {
        return value.rl_tiga_titik_sepuluh_details;
      });

      let dataRLTigaTitikSepuluhDetails = [];
      rlTigaTitikSepuluhDetails.forEach((element) => {
        element.forEach((value) => {
          dataRLTigaTitikSepuluhDetails.push(value);
        });
      });
      setDataRL(dataRLTigaTitikSepuluhDetails);
      setRumahSakit(null);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const hapusData = async (id) => {
    const customConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const results = await axiosJWT.delete(
        `/apisirs6v2/rltigatitiksepuluh/${id}`,
        customConfig
      );
      // getDataRLTigaTitikSepuluh();
      toast("Data Berhasil Dihapus", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setDataRL((current) => current.filter((value) => value.id !== id));
    } catch (error) {
      console.log(error);
      toast("Data Gagal Disimpan", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const hapus = (id) => {
    confirmAlert({
      title: "Konfirmasi Penghapusan",
      message: "Apakah Anda Yakin ?",
      buttons: [
        {
          label: "Ya",
          onClick: () => {
            hapusData(id);
          },
        },
        {
          label: "Tidak",
        },
      ],
    });
  };

  const handleClose = () => setShow(false);

  const handleShow = () => {
    const jenisUserId = user.jenisUserId;
    const satKerId = user.satKerId;
    switch (jenisUserId) {
      case 1:
        getProvinsi();
        setBulan(1);
        setShow(true);
        break;
      case 2:
        getKabKota(satKerId);
        setBulan(1);
        setShow(true);
        break;
      case 3:
        getRumahSakit(satKerId);
        setBulan(1);
        setShow(true);
        break;
      case 4:
        showRumahSakit(satKerId);
        setBulan(1);
        setShow(true);
        break;
      default:
    }
  };

  const getProvinsi = async () => {
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const results = await axiosJWT.get("/apisirs6v2/provinsi", customConfig);

      const daftarProvinsi = results.data.data.map((value) => {
        return value;
      });

      setDaftarProvinsi(daftarProvinsi);
    } catch (error) {
      console.log(error);
    }
  };

  const getKabKota = async (provinsiId) => {
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          provinsiId: provinsiId,
        },
      };
      const results = await axiosJWT.get("/apisirs6v2/kabkota", customConfig);

      const daftarKabKota = results.data.data.map((value) => {
        return value;
      });

      setDaftarKabKota(daftarKabKota);
    } catch (error) {
      console.log(error);
    }
  };

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

  let total = {
    rm_diterima_puskesmas: 0,
    rm_diterima_rs: 0,
    rm_diterima_faskes_lain: 0,
    rm_diterima_total_rm: 0,
    rm_dikembalikan_puskesmas: 0,
    rm_dikembalikan_rs: 0,
    rm_dikembalikan_faskes_lain: 0,
    rm_dikembalikan_total_rm: 0,
    keluar_pasien_rujukan: 0,
    keluar_pasien_datang_sendiri: 0,
    keluar_total_keluar: 0,
    keluar_diterima_kembali: 0,
  };

  dataRL.map((value, index) => {
    total.rm_diterima_puskesmas += parseInt(value.rm_diterima_puskesmas);
    total.rm_diterima_rs += parseInt(value.rm_diterima_rs);
    total.rm_diterima_faskes_lain += parseInt(value.rm_diterima_faskes_lain);
    total.rm_diterima_total_rm += parseInt(value.rm_diterima_total_rm);
    total.rm_dikembalikan_puskesmas += parseInt(
      value.rm_dikembalikan_puskesmas
    );
    total.rm_dikembalikan_rs += parseInt(value.rm_dikembalikan_rs);
    total.rm_dikembalikan_faskes_lain += parseInt(
      value.rm_dikembalikan_faskes_lain
    );
    total.rm_dikembalikan_total_rm += parseInt(value.rm_dikembalikan_total_rm);
    total.keluar_pasien_rujukan += parseInt(value.keluar_pasien_rujukan);
    total.keluar_pasien_datang_sendiri += parseInt(
      value.keluar_pasien_datang_sendiri
    );
    total.keluar_total_keluar += parseInt(value.keluar_total_keluar);
    total.keluar_diterima_kembali += parseInt(value.keluar_diterima_kembali);
  });

  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <Modal show={show} onHide={handleClose} style={{ position: "fixed" }}>
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>

        <form onSubmit={getDataRLTigaTitikSepuluh}>
          <Modal.Body>
            {user.jenisUserId === 1 ? (
              <>
                <div
                  className="form-floating"
                  style={{ width: "100%", paddingBottom: "5px" }}
                >
                  <select
                    name="provinsi"
                    id="provinsi"
                    typeof="select"
                    className="form-select"
                    onChange={(e) => getKabKota(e.target.value)}
                  >
                    <option key={0} value={0}>
                      Pilih
                    </option>
                    {daftarProvinsi.map((nilai) => {
                      return (
                        <option key={nilai.id} value={nilai.id}>
                          {nilai.nama}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="provinsi">Provinsi</label>
                </div>

                <div
                  className="form-floating"
                  style={{ width: "100%", paddingBottom: "5px" }}
                >
                  <select
                    name="kabKota"
                    id="kabKota"
                    typeof="select"
                    className="form-select"
                    onChange={(e) => getRumahSakit(e.target.value)}
                  >
                    <option key={0} value={0}>
                      Pilih
                    </option>
                    {daftarKabKota.map((nilai) => {
                      return (
                        <option key={nilai.id} value={nilai.id}>
                          {nilai.nama}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="kabKota">Kab/Kota</label>
                </div>

                <div
                  className="form-floating"
                  style={{ width: "100%", paddingBottom: "5px" }}
                >
                  <select
                    name="rumahSakit"
                    id="rumahSakit"
                    typeof="select"
                    className="form-select"
                    onChange={(e) => showRumahSakit(e.target.value)}
                  >
                    <option key={0} value={0}>
                      Pilih
                    </option>
                    {daftarRumahSakit.map((nilai) => {
                      return (
                        <option key={nilai.id} value={nilai.id}>
                          {nilai.nama}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="rumahSakit">Rumah Sakit</label>
                </div>
              </>
            ) : (
              <></>
            )}
            {user.jenisUserId === 2 ? (
              <>
                <div
                  className="form-floating"
                  style={{ width: "100%", paddingBottom: "5px" }}
                >
                  <select
                    name="kabKota"
                    id="kabKota"
                    typeof="select"
                    className="form-select"
                    onChange={(e) => getRumahSakit(e.target.value)}
                  >
                    <option key={0} value={0}>
                      Pilih
                    </option>
                    {daftarKabKota.map((nilai) => {
                      return (
                        <option key={nilai.id} value={nilai.id}>
                          {nilai.nama}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="kabKota">Kab/Kota</label>
                </div>

                <div
                  className="form-floating"
                  style={{ width: "100%", paddingBottom: "5px" }}
                >
                  <select
                    name="rumahSakit"
                    id="rumahSakit"
                    typeof="select"
                    className="form-select"
                    onChange={(e) => showRumahSakit(e.target.value)}
                  >
                    <option key={0} value={0}>
                      Pilih
                    </option>
                    {daftarRumahSakit.map((nilai) => {
                      return (
                        <option key={nilai.id} value={nilai.id}>
                          {nilai.nama}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="rumahSakit">Rumah Sakit</label>
                </div>
              </>
            ) : (
              <></>
            )}
            {user.jenisUserId === 3 ? (
              <>
                <div
                  className="form-floating"
                  style={{ width: "100%", paddingBottom: "5px" }}
                >
                  <select
                    name="rumahSakit"
                    id="rumahSakit"
                    typeof="select"
                    className="form-select"
                    onChange={(e) => showRumahSakit(e.target.value)}
                  >
                    <option key={0} value={0}>
                      Pilih
                    </option>
                    {daftarRumahSakit.map((nilai) => {
                      return (
                        <option key={nilai.id} value={nilai.id}>
                          {nilai.nama}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="rumahSakit">Rumah Sakit</label>
                </div>
              </>
            ) : (
              <></>
            )}
            <div
              className="form-floating"
              style={{ width: "70%", display: "inline-block" }}
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
              <label>Bulan</label>
            </div>
            <div
              className="form-floating"
              style={{ width: "30%", display: "inline-block" }}
            >
              <input
                name="tahun"
                type="number"
                className="form-control"
                id="tahun"
                placeholder="Tahun"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                disabled={false}
              />
              <label htmlFor="tahun">Tahun</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="mt-3 mb-3">
              <ToastContainer />
              <button type="submit" className="btn btn-outline-success">
                <HiSaveAs size={20} /> Terapkan
              </button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
      {/* <div className="row">
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
                  id="floatingInput"
                  value={namaRS}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Nama</label>
              </div>
              <div
                className="form-floating"
                style={{ width: "100%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={alamatRS}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Alamat</label>
              </div>
              <div
                className="form-floating"
                style={{ width: "50%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaPropinsi}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Provinsi </label>
              </div>
              <div
                className="form-floating"
                style={{ width: "50%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaKabKota}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Kab/Kota</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title h5">Periode Laporan</h5>
              <form onSubmit={Cari}>
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
                    onChange={(e) => changeHandlerSingle(e)}
                  />
                  <label htmlFor="floatingInput">Tahun</label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
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
                  <label htmlFor="floatingInput">Bulan</label>
                </div>
                <div className="mt-3 mb-3">
                  <button
                    type="submit"
                    className="btn btn-outline-success w-100"
                  >
                    <HiSaveAs /> Cari
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      <div className="row">
        <div className="col-md-12">
          <div style={{ marginBottom: "10px" }}>
            {user.jenisUserId === 4 ? (
              <Link
                className="btn"
                to={`/rl310/tambah/`}
                style={{
                  marginRight: "5px",
                  fontSize: "18px",
                  backgroundColor: "#779D9E",
                  color: "#FFFFFF",
                }}
              >
                +
              </Link>
            ) : (
              <></>
            )}
            <button
              className="btn"
              style={{
                fontSize: "18px",
                backgroundColor: "#779D9E",
                color: "#FFFFFF",
              }}
              onClick={handleShow}
            >
              Filter
            </button>
          </div>

          {filterLabel.length > 0 ? (
            <div>
              <h5 style={{ fontSize: "14px" }}>
                Filtered By{" "}
                {filterLabel
                  .map((value) => {
                    return value;
                  })
                  .join(", ")}
              </h5>
            </div>
          ) : (
            <></>
          )}

          <Table
            className={style.rlTable}
            striped
            responsive
            style={{ width: "200%" }}
          >
            <thead>
              <tr>
                <th
                  style={{ width: "4%", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  No Spesialisasi
                </th>
                <th
                  style={{ width: "4%", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  Aksi
                </th>
                <th
                  style={{ width: "20%", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  Jenis Spesialisasi
                </th>
                <th colSpan={8}>Rujukan Masuk</th>
                <th colSpan={4} rowSpan={2} style={{ verticalAlign: "middle" }}>
                  Dirujuk Keluar
                </th>
              </tr>
              <tr>
                <th colSpan={4}>Diterima Dari</th>
                <th colSpan={4}>Dikembalikan Ke</th>
              </tr>
              <tr>
                <th>Puskesmas</th>
                <th>RS Lain</th>
                <th>Faskes Lain</th>
                <th>Total Rujukan Masuk</th>
                <th>Puskesmas</th>
                <th>RS Lain</th>
                <th>Faskes Lain</th>
                <th>Total Rujukan Masuk Dikembalikan</th>
                <th>Pasien Rujukn</th>
                <th>Pasien Datang Sendiri</th>
                <th>Total Dirujuk Keluar</th>
                <th>Diterima Kembali</th>
              </tr>
            </thead>
            <tbody>
              {dataRL.length > 0 ? (
                <>
                  {dataRL.map((value, index) => {
                    return (
                      <tr key={value.id}>
                        <td>
                          <input
                            type="text"
                            name="no"
                            className="form-control"
                            value={
                              value.jenis_spesialis_rl_tiga_titik_sepuluh.no
                            }
                            disabled={true}
                          />
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <ToastContainer />
                          {/* <RiDeleteBin5Fill size={20} onClick={(e) => hapus(value.id)} style={{ color: "gray", cursor: "pointer", marginRight: "5px" }} /> */}
                          <button
                            className="btn btn-danger"
                            style={{
                              margin: "0 5px 0 0",
                              backgroundColor: "#FF6663",
                              border: "1px solid #FF6663",
                            }}
                            type="button"
                            onClick={(e) => hapus(value.id)}
                          >
                            Hapus
                          </button>
                          <Link
                            to={`/rl310/edit/${value.id}`}
                            className="btn btn-warning"
                            style={{
                              margin: "0 5px 0 0",
                              backgroundColor: "#CFD35E",
                              border: "1px solid #CFD35E",
                              color: "#FFFFFF",
                            }}
                          >
                            Ubah
                            {/* <RiEdit2Fill size={20} style={{ color: "gray", cursor: "pointer" }} /> */}
                          </Link>
                        </td>
                        <td>
                          <input
                            type="text"
                            name="nama"
                            className="form-control"
                            value={
                              value.jenis_spesialis_rl_tiga_titik_sepuluh.nama
                            }
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rm_diterima_puskesmas"
                            className="form-control"
                            value={value.rm_diterima_puskesmas}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rm_diterima_rs"
                            className="form-control"
                            value={value.rm_diterima_rs}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rm_diterima_faskes_lain"
                            className="form-control"
                            value={value.rm_diterima_faskes_lain}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rm_diterima_total_rm"
                            className="form-control"
                            value={value.rm_diterima_total_rm}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rm_dikembalikan_puskesmas"
                            className="form-control"
                            value={value.rm_dikembalikan_puskesmas}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rm_dikembalikan_rs"
                            className="form-control"
                            value={value.rm_dikembalikan_rs}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rm_dikembalikan_faskes_lain"
                            className="form-control"
                            value={value.rm_dikembalikan_faskes_lain}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rm_dikembalikan_total_rm"
                            className="form-control"
                            value={value.rm_dikembalikan_total_rm}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="keluar_pasien_rujukan"
                            className="form-control"
                            value={value.keluar_pasien_rujukan}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="keluar_pasien_datang_sendiri"
                            className="form-control"
                            value={value.keluar_pasien_datang_sendiri}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="keluar_total_keluar"
                            className="form-control"
                            value={value.keluar_total_keluar}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="keluar_diterima_kembali"
                            className="form-control"
                            value={value.keluar_diterima_kembali}
                            disabled={true}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={3} className="text-center">
                      <strong>Total</strong>
                    </td>
                    <td className="text-center">
                      {total.rm_diterima_puskesmas}
                    </td>
                    <td className="text-center">{total.rm_diterima_rs}</td>
                    <td className="text-center">
                      {total.rm_diterima_faskes_lain}
                    </td>
                    <td className="text-center">
                      {total.rm_diterima_total_rm}
                    </td>
                    <td className="text-center">
                      {total.rm_dikembalikan_puskesmas}
                    </td>
                    <td className="text-center">{total.rm_dikembalikan_rs}</td>
                    <td className="text-center">
                      {total.rm_dikembalikan_faskes_lain}
                    </td>
                    <td className="text-center">
                      {total.rm_dikembalikan_total_rm}
                    </td>
                    <td className="text-center">
                      {total.keluar_pasien_rujukan}
                    </td>
                    <td className="text-center">
                      {total.keluar_pasien_datang_sendiri}
                    </td>
                    <td className="text-center">{total.keluar_total_keluar}</td>
                    <td className="text-center">
                      {total.keluar_diterima_kembali}
                    </td>
                  </tr>
                </>
              ) : (
                <></>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RL310;
