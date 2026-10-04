package com.example.kenglish;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;

import com.example.kenglish.api.ApiService;
import com.example.kenglish.api.RetrofitClient;
import com.example.kenglish.model.ApiResponse;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


/**
 * Fragment hiển thị thông tin cá nhân và cài đặt người dùng.
 */
public class CaNhan extends Fragment {

    private LinearLayout cardDangXuat;
    private LinearLayout cardXoaTaiKhoan;
    private LinearLayout cardCongDongZalo;
    private TextView txtHoTen;
    private ImageView btnFacebook;
    private ImageView btnInstagram;


    /**
     * Khởi tạo giao diện của màn hình Cá nhân.
     */
    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {

        View view = inflater.inflate(
                R.layout.ca_nhan,
                container,
                false
        );

        anhXa(view);
        hienThiThongTinUser();
        xuLySuKien();

        return view;
    }


    /**
     * Ánh xạ các View cần xử lý sự kiện.
     */
    private void anhXa(View view) {
        cardDangXuat = view.findViewById(R.id.card_dang_xuat);
        cardXoaTaiKhoan = view.findViewById(R.id.card_xoa_tai_khoan);
        cardCongDongZalo = view.findViewById(R.id.card_cong_dong_zalo);
        txtHoTen = view.findViewById(R.id.txt_ho_ten);
        btnFacebook = view.findViewById(R.id.btn_facebook);
        btnInstagram = view.findViewById(R.id.btn_instagram);
    }

    private void hienThiThongTinUser() {
        SharedPreferences sharedPreferences = requireContext().getSharedPreferences(
                "Kenglish",
                Context.MODE_PRIVATE
        );

        String tenHienThi = sharedPreferences.getString("ten_hien_thi", "Người dùng");

        txtHoTen.setText(tenHienThi);
    }


    /**
     * Gắn các sự kiện cho giao diện.
     */
    private void xuLySuKien() {

        cardDangXuat.setOnClickListener(v -> {
            xuLyDangXuat();
        });

        cardXoaTaiKhoan.setOnClickListener(v -> {
            hienThiXacNhanXoaTaiKhoan();
        });

        cardCongDongZalo.setOnClickListener(v -> {

            String linkZalo = "https://zalo.me/g/oiee8nc0lpggvkgwr14t";

            Intent intent = new Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse(linkZalo)
            );

            startActivity(intent);
        });

        btnFacebook.setOnClickListener(v -> {
            String linkFacebook = "https://www.facebook.com/ltk6805";

            Intent intent = new Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse(linkFacebook)
            );

            startActivity(intent);
        });

        btnInstagram.setOnClickListener(v -> {
            String linkInstagram = "https://www.instagram.com/ltk6805";

            Intent intent = new Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse(linkInstagram)
            );

            startActivity(intent);
        });
    }


    private void xuLyNhacHoc() {
        // Mở tab nhắc học
    }


    private void xuLyCongDong() {
        // Mở link Zalo
    }


    private void xuLyLienHeHoTro() {
        // Mở trang hỗ trợ
    }


    private void xuLyChinhSach() {
        // Mở chính sách
    }


    private void xuLyDieuKhoan() {
        // Mở điều khoản
    }


    private void xuLyMangXaHoi() {
        // Facebook / Instagram
    }

    /**
     * Gửi yêu cầu đăng xuất tới backend.
     */
    private void xuLyDangXuat() {

        // Lấy SharedPreferences đang lưu token đăng nhập
        SharedPreferences sharedPreferences =
                requireActivity().getSharedPreferences(
                        "Kenglish",
                        requireActivity().MODE_PRIVATE
                );

        String token = sharedPreferences.getString(
                "token",
                null
        );

        // Không có token thì đưa về màn hình đăng nhập luôn
        if (token == null || token.isEmpty()) {
            chuyenVeDangNhap();
            return;
        }

        // Tạo ApiService
        ApiService apiService =
                RetrofitClient.getClient().create(ApiService.class);

        // Gửi token theo chuẩn Bearer
        apiService.dangXuat("Bearer " + token)
                .enqueue(new Callback<ApiResponse>() {

                    @Override
                    public void onResponse(
                            @NonNull Call<ApiResponse> call,
                            @NonNull Response<ApiResponse> response) {

                        if (response.isSuccessful()
                                && response.body() != null
                                && response.body().isThanhCong()) {

                            // Backend logout thành công
                            // → xóa token trên Android
                            sharedPreferences
                                    .edit()
                                    .remove("token")
                                    .apply();

                            chuyenVeDangNhap();

                        } else {

                            Toast.makeText(
                                    requireContext(),
                                    "Đăng xuất thất bại",
                                    Toast.LENGTH_SHORT
                            ).show();
                        }
                    }


                    @Override
                    public void onFailure(
                            @NonNull Call<ApiResponse> call,
                            @NonNull Throwable t) {

                        Toast.makeText(
                                requireContext(),
                                "Không thể kết nối đến máy chủ",
                                Toast.LENGTH_SHORT
                        ).show();
                    }
                });
    }


    /**
     * Chuyển về màn hình đăng nhập và đóng MainActivity.
     */
    private void chuyenVeDangNhap() {

        Intent intent =
                new Intent(requireContext(), DangNhapActivity.class);

        intent.setFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK |
                        Intent.FLAG_ACTIVITY_CLEAR_TASK
        );

        startActivity(intent);

        requireActivity().overridePendingTransition(
                R.anim.slide_in_left,
                R.anim.slide_out_right
        );
    }

    private void hienThiXacNhanXoaTaiKhoan() {
        new AlertDialog.Builder(requireContext())
                .setTitle("Xóa tài khoản")
                .setMessage(
                        "Bạn có chắc chắn muốn xóa tài khoản? " +
                                "Bạn sẽ cần đăng ký và xác thực email lại nếu muốn sử dụng tài khoản này."
                )
                .setNegativeButton("Hủy", null)
                .setPositiveButton("Xóa", (dialog, which) -> {
                    xoaTaiKhoan();
                })
                .show();
    }

    private void xoaTaiKhoan() {

        SharedPreferences sharedPreferences =
                requireContext().getSharedPreferences(
                        "Kenglish",
                        Context.MODE_PRIVATE
                );

        String token =
                sharedPreferences.getString("token", null);

        if (token == null) {
            chuyenVeDangNhap();
            return;
        }

        ApiService apiService =
                RetrofitClient.getClient().create(ApiService.class);

        apiService.xoaTaiKhoan("Bearer " + token)
                .enqueue(new Callback<ApiResponse>() {

                    @Override
                    public void onResponse(
                            Call<ApiResponse> call,
                            Response<ApiResponse> response
                    ) {

                        if (response.isSuccessful()
                                && response.body() != null
                                && response.body().isThanhCong()) {

                            // Xóa toàn bộ thông tin đăng nhập local
                            sharedPreferences
                                    .edit()
                                    .clear()
                                    .apply();

                            Toast.makeText(
                                    requireContext(),
                                    "Xóa tài khoản thành công",
                                    Toast.LENGTH_SHORT
                            ).show();

                            chuyenVeDangNhap();

                        } else {
                            Toast.makeText(
                                    requireContext(),
                                    "Không thể xóa tài khoản",
                                    Toast.LENGTH_SHORT
                            ).show();
                        }
                    }

                    @Override
                    public void onFailure(
                            Call<ApiResponse> call,
                            Throwable t
                    ) {
                        Toast.makeText(
                                requireContext(),
                                "Không thể kết nối đến server",
                                Toast.LENGTH_SHORT
                        ).show();
                    }
                });
    }
}