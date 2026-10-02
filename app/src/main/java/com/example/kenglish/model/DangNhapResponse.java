package com.example.kenglish.model;

public class DangNhapResponse {

    private boolean thanh_cong;
    private String thong_bao;
    private String token;
    private NguoiDung nguoi_dung;

    public boolean isThanhCong() {
        return thanh_cong;
    }

    public String getThongBao() {
        return thong_bao;
    }

    public String getToken() {
        return token;
    }

    public NguoiDung getNguoiDung() {
        return nguoi_dung;
    }
}