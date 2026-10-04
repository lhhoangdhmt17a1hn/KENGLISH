package com.example.kenglish.model;

public class TaoBoTuRequest {

    private String ten_bo_tu;
    private String mo_ta;
    private Integer folder_id;

    public TaoBoTuRequest(
            String ten_bo_tu,
            String mo_ta,
            Integer folder_id
    ) {
        this.ten_bo_tu = ten_bo_tu;
        this.mo_ta = mo_ta;
        this.folder_id = folder_id;
    }
}