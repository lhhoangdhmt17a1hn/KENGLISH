package com.example.kenglish.model;

public class ThemTuRequest {

    private String tu_goc;
    private String phien_am;
    private String loai_tu;
    private String nghia_tieng_viet;
    private String cau_vi_du;
    private String tu_dong_nghia;
    private String tu_trai_nghia;

    public ThemTuRequest(
            String tu_goc,
            String phien_am,
            String loai_tu,
            String nghia_tieng_viet,
            String cau_vi_du,
            String tu_dong_nghia,
            String tu_trai_nghia
    ) {
        this.tu_goc = tu_goc;
        this.phien_am = phien_am;
        this.loai_tu = loai_tu;
        this.nghia_tieng_viet = nghia_tieng_viet;
        this.cau_vi_du = cau_vi_du;
        this.tu_dong_nghia = tu_dong_nghia;
        this.tu_trai_nghia = tu_trai_nghia;
    }
}