package com.example.kenglish.model;

public class ApiResponse<T> {

    private boolean thanh_cong;
    private String thong_bao;
    private T data;

    public boolean isThanhCong() {
        return thanh_cong;
    }

    public String getThongBao() {
        return thong_bao;
    }

    public T getData() {
        return data;
    }
}