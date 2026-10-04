package com.example.kenglish.api;

import com.example.kenglish.model.ApiResponse;
import com.example.kenglish.model.DangKyRequest;
import com.example.kenglish.model.DangNhapRequest;
import com.example.kenglish.model.DangNhapResponse;
import com.example.kenglish.model.XacThucEmailRequest;
import com.example.kenglish.model.DictionaryResponse;
import com.example.kenglish.model.SuggestionResponse;
import com.example.kenglish.model.LichSuTraTuResponse;
import com.example.kenglish.model.ThemLichSuRequest;

import retrofit2.http.GET;
import retrofit2.http.Query;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
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

    @DELETE("user/me")
    Call<ApiResponse> xoaTaiKhoan(
            @Header("Authorization") String token
    );

    @GET("dictionary/search")
    Call<SuggestionResponse> timKiemTu(
            @Query("q") String tuKhoa
    );

    @GET("dictionary/lookup")
    Call<DictionaryResponse> traTu(
            @Query("word") String tu
    );

    @POST("dictionary/history")
    Call<ApiResponse> themLichSuTraTu(
            @Header("Authorization") String token,
            @Body ThemLichSuRequest request
    );

    @GET("dictionary/history")
    Call<LichSuTraTuResponse> layLichSuTraTu(
            @Header("Authorization") String token
    );

    @DELETE("dictionary/history")
    Call<ApiResponse> xoaLichSuTraTu(
            @Header("Authorization") String token
    );
}