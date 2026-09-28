package com.example.kenglish.api;

import com.example.kenglish.model.ApiResponse;
import com.example.kenglish.model.DangKyRequest;
import com.example.kenglish.model.DangNhapRequest;
import com.example.kenglish.model.DangNhapResponse;
import com.example.kenglish.model.XacThucEmailRequest;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface ApiService {

    @POST("auth/dang-ky")
    Call<ApiResponse> dangKy(
            @Body DangKyRequest request
    );

    @POST("auth/xac-thuc-email")
    Call<ApiResponse> xacThucEmail(
            @Body XacThucEmailRequest request
    );

    @POST("auth/dang-nhap")
    Call<DangNhapResponse> dangNhap(
            @Body DangNhapRequest request
    );

    @POST("auth/dang-xuat")
    Call<ApiResponse> dangXuat(
            @Header("Authorization") String token
    );
}