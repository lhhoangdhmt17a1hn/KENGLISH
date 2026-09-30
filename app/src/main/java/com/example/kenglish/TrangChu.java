package com.example.kenglish;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.button.MaterialButton;


/**
 * Fragment hiển thị màn hình Trang chủ.
 */
public class TrangChu extends Fragment {

    /*
     * Khu vực từ đến hạn.
     */
    private LinearLayout layoutTuDenHan;


    /*
     * Ảnh đại diện.
     */
    private TextView txtAnhDaiDien;


    /*
     * Số ngày chuỗi học.
     *
     * Icon lửa được đặt cố định bằng ImageView trong XML,
     * vì vậy không cần ánh xạ icon tại đây.
     */
    private TextView txtChuoiHoc;
    private TextView btnBoTu;


    /**
     * Khởi tạo giao diện Trang chủ.
     */
    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {

        View view = inflater.inflate(
                R.layout.trang_chu,
                container,
                false
        );


        anhXa(view);

        thietLapSuKienAnhDaiDien();

        thietLapSuKienTuDenHan();

        thietLapSuKienTaoBoTu();

        hienThiChuoiHoc();


        return view;
    }


    /**
     * Ánh xạ các thành phần giao diện.
     */
    private void anhXa(View view) {

        /*
         * Thông tin người dùng.
         */
        txtAnhDaiDien =
                view.findViewById(
                        R.id.txt_anh_dai_dien
                );

        txtChuoiHoc =
                view.findViewById(
                        R.id.txt_chuoi_hoc
                );

        btnBoTu =
                view.findViewById(
                        R.id.btn_tao_bo_tu
                );


        /*
         * Khu vực từ đến hạn.
         */
        layoutTuDenHan =
                view.findViewById(
                        R.id.layout_tudenhan
                );
    }


    /**
     * Hiển thị chuỗi học hiện tại.
     * <p>
     * Hiện tại đang dùng dữ liệu mẫu.
     * Sau này có Backend chỉ cần thay giá trị này
     * bằng dữ liệu của người dùng.
     */
    private void hienThiChuoiHoc() {

        int chuoiHoc = 32;

        txtChuoiHoc.setText(
                String.valueOf(chuoiHoc)
        );
    }


    /**
     * Thiết lập sự kiện cho các nút lọc.
     */


    /**
     * Khi nhấn ảnh đại diện
     * sẽ chuyển sang tab Cá nhân.
     */
    private void thietLapSuKienAnhDaiDien() {

        txtAnhDaiDien.setOnClickListener(v -> {

            BottomNavigationView thanhDieuHuong =
                    requireActivity().findViewById(
                            R.id.thanh_dieu_huong
                    );

            thanhDieuHuong.setSelectedItemId(
                    R.id.menu_ca_nhan
            );
        });
    }


    /**
     * Khi nhấn vào khu vực từ đến hạn
     * sẽ chuyển sang tab Luyện tập.
     */
    private void thietLapSuKienTuDenHan() {

        layoutTuDenHan.setOnClickListener(v -> {

            BottomNavigationView thanhDieuHuong =
                    requireActivity().findViewById(
                            R.id.thanh_dieu_huong
                    );

            thanhDieuHuong.setSelectedItemId(
                    R.id.menu_luyen_tap
            );
        });
    }

    private void thietLapSuKienTaoBoTu() {

        btnBoTu.setOnClickListener(v -> {

            BottomNavigationView thanhDieuHuong =
                    requireActivity().findViewById(
                            R.id.thanh_dieu_huong
                    );

            thanhDieuHuong.setSelectedItemId(
                    R.id.menu_bo_tu
            );
        });
    }
}

