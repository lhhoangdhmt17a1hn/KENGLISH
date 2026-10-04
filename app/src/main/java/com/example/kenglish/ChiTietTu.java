package com.example.kenglish;

import android.media.MediaPlayer;
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
import androidx.fragment.app.Fragment;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.kenglish.api.ApiService;
import com.example.kenglish.api.RetrofitClient;
import com.example.kenglish.model.DictionaryResponse;
import com.example.kenglish.model.Meaning;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.example.kenglish.model.ApiResponse;
import com.example.kenglish.model.ThemLichSuRequest;



import java.io.IOException;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChiTietTu extends Fragment {

    private TextView txtTuVung;
    private TextView txtIpa;
    private TextView btnLuuTu;

    private ImageView btnQuayLai;
    private ImageView btnPhatAm;

    private LinearLayout layoutDanhSachNghia;

    private ApiService apiService;

    private String tuCanTra;
    private String audioUrl;

    private MediaPlayer mediaPlayer;


    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {

        View view = inflater.inflate(
                R.layout.chitiettu,
                container,
                false
        );

        anhXa(view);

        BottomNavigationView thanhDieuHuong =
                requireActivity().findViewById(
                        R.id.thanh_dieu_huong
                );

        thanhDieuHuong.setVisibility(
                View.GONE
        );

        apiService =
                RetrofitClient
                        .getClient()
                        .create(ApiService.class);

        layTuCanTra();

        thietLapSuKien();

        if (tuCanTra != null && !tuCanTra.isEmpty()) {

            traTu(tuCanTra);

        } else {

            Toast.makeText(
                    requireContext(),
                    "Không tìm thấy từ cần tra",
                    Toast.LENGTH_SHORT
            ).show();
        }

        return view;
    }


    /**
     * Ánh xạ giao diện.
     */
    private void anhXa(View view) {

        txtTuVung =
                view.findViewById(
                        R.id.txt_tu_vung
                );

        txtIpa =
                view.findViewById(
                        R.id.txt_ipa
                );

        btnQuayLai =
                view.findViewById(
                        R.id.btn_quay_lai
                );

        btnPhatAm =
                view.findViewById(
                        R.id.btn_phat_am
                );

        btnLuuTu =
                view.findViewById(
                        R.id.btn_luu_tu
                );

        layoutDanhSachNghia =
                view.findViewById(
                        R.id.layout_danh_sach_nghia
                );
    }




    /**
     * Lấy từ được truyền từ Trang chủ.
     */
    private void layTuCanTra() {

        Bundle bundle = getArguments();

        if (bundle != null) {

            tuCanTra =
                    bundle.getString("tu");
        }
    }

    @Override
    public void onResume() {
        super.onResume();

        BottomNavigationView thanhDieuHuong =
                requireActivity().findViewById(
                        R.id.thanh_dieu_huong
                );

        thanhDieuHuong.setVisibility(View.GONE);
    }


    @Override
    public void onPause() {
        super.onPause();

        BottomNavigationView thanhDieuHuong =
                requireActivity().findViewById(
                        R.id.thanh_dieu_huong
                );

        thanhDieuHuong.setVisibility(View.VISIBLE);
    }


    /**
     * Thiết lập các sự kiện.
     */
    private void thietLapSuKien() {

        btnQuayLai.setOnClickListener(v ->
                requireActivity()
                        .getSupportFragmentManager()
                        .popBackStack()
        );


        btnPhatAm.setOnClickListener(v ->
                phatAm()
        );


        btnLuuTu.setOnClickListener(v -> {

            // Làm sau khi tạo API lưu từ.
            Toast.makeText(
                    requireContext(),
                    "Chức năng lưu từ sẽ làm tiếp",
                    Toast.LENGTH_SHORT
            ).show();
        });
    }


    /**
     * Gọi backend Kenglish để tra từ.
     */
    private void traTu(String tu) {

        apiService
                .traTu(tu)
                .enqueue(
                        new Callback<DictionaryResponse>() {

                            @Override
                            public void onResponse(
                                    @NonNull Call<DictionaryResponse> call,
                                    @NonNull Response<DictionaryResponse> response) {

                                if (!isAdded()) {
                                    return;
                                }

                                if (response.isSuccessful()
                                        && response.body() != null) {

                                    hienThiChiTietTu(
                                            response.body()
                                    );

                                    themVaoLichSu(
                                            response.body().getWord()
                                    );
                                } else {

                                    Toast.makeText(
                                            requireContext(),
                                            "Không tìm thấy từ",
                                            Toast.LENGTH_SHORT
                                    ).show();
                                }
                            }


                            @Override
                            public void onFailure(
                                    @NonNull Call<DictionaryResponse> call,
                                    @NonNull Throwable t) {

                                if (!isAdded()) {
                                    return;
                                }

                                Toast.makeText(
                                        requireContext(),
                                        "Không thể kết nối đến server",
                                        Toast.LENGTH_SHORT
                                ).show();
                            }
                        }
                );
    }


    /**
     * Hiển thị dữ liệu từ API.
     */
    private void hienThiChiTietTu(
            DictionaryResponse duLieu) {

        txtTuVung.setText(
                duLieu.getWord()
        );


        /*
         * IPA.
         */
        if (duLieu.getIpa() != null
                && !duLieu.getIpa().isEmpty()) {

            txtIpa.setText(
                    duLieu.getIpa()
            );

            txtIpa.setVisibility(
                    View.VISIBLE
            );

        } else {

            txtIpa.setVisibility(
                    View.GONE
            );
        }


        /*
         * Lưu URL phát âm.
         */
        audioUrl =
                duLieu.getAudio();


        /*
         * Hiển thị nghĩa.
         */
        hienThiDanhSachNghia(
                duLieu.getMeanings()
        );
    }


    /**
     * Hiển thị danh sách nghĩa.
     */
    private void hienThiDanhSachNghia(
            List<Meaning> danhSachNghia) {

        /*
         * Xóa dữ liệu mẫu trong XML.
         */
        layoutDanhSachNghia.removeAllViews();


        if (danhSachNghia == null
                || danhSachNghia.isEmpty()) {

            TextView txtKhongCoNghia =
                    new TextView(
                            requireContext()
                    );

            txtKhongCoNghia.setText(
                    "Chưa có nghĩa cho từ này."
            );

            txtKhongCoNghia.setTextSize(13);

            txtKhongCoNghia.setTextColor(
                    getResources().getColor(
                            android.R.color.darker_gray,
                            null
                    )
            );

            layoutDanhSachNghia.addView(
                    txtKhongCoNghia
            );

            return;
        }


        /*
         * Dùng để tránh hiện:
         *
         * Danh từ
         * 1...
         * Danh từ
         * 2...
         * Danh từ
         * 3...
         *
         * Nếu cùng loại từ thì chỉ hiện một lần.
         */
        String loaiTuTruoc = null;


        for (int i = 0;
             i < danhSachNghia.size();
             i++) {

            Meaning meaning =
                    danhSachNghia.get(i);


            /*
             * Nếu loại từ thay đổi
             * thì mới thêm tiêu đề loại từ.
             */
            if (meaning.getPos() != null
                    && !meaning.getPos().equals(loaiTuTruoc)) {

                TextView txtLoaiTu =
                        taoTextLoaiTu(
                                meaning.getPos()
                        );

                layoutDanhSachNghia.addView(
                        txtLoaiTu
                );

                loaiTuTruoc =
                        meaning.getPos();
            }


            /*
             * Thêm nghĩa.
             */
            TextView txtNghia =
                    taoTextNghia(
                            i + 1,
                            meaning.getDefinition()
                    );

            layoutDanhSachNghia.addView(
                    txtNghia
            );


            /*
             * Nếu API có example thì hiện.
             */
            if (meaning.getExample() != null
                    && !meaning.getExample().isEmpty()) {

                TextView txtViDu =
                        taoTextViDu(
                                meaning.getExample()
                        );

                layoutDanhSachNghia.addView(
                        txtViDu
                );
            }
        }
    }


    /**
     * Tạo TextView loại từ.
     */
    private TextView taoTextLoaiTu(
            String loaiTu) {

        TextView textView =
                new TextView(
                        requireContext()
                );

        textView.setText(
                loaiTu
        );

        textView.setTextSize(11);

        textView.setTextColor(
                android.graphics.Color.parseColor(
                        "#37659C"
                )
        );

        textView.setTypeface(
                getResources().getFont(
                        R.font.juve_normal
                )
        );


        LinearLayout.LayoutParams params =
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );

        params.topMargin =
                dpToPx(6);

        params.bottomMargin =
                dpToPx(6);

        textView.setLayoutParams(
                params
        );

        return textView;
    }


    /**
     * Tạo TextView nghĩa.
     */
    private TextView taoTextNghia(
            int soThuTu,
            String nghia) {

        TextView textView =
                new TextView(
                        requireContext()
                );

        textView.setText(
                soThuTu + ". " + nghia
        );

        textView.setTextSize(13);

        textView.setTextColor(
                android.graphics.Color.parseColor(
                        "#4F4F4F"
                )
        );

        textView.setTypeface(
                getResources().getFont(
                        R.font.juve_normal
                )
        );

        textView.setLineSpacing(
                dpToPx(3),
                1f
        );


        LinearLayout.LayoutParams params =
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );

        params.bottomMargin =
                dpToPx(12);

        textView.setLayoutParams(
                params
        );

        return textView;
    }


    /**
     * Tạo TextView ví dụ.
     */
    private TextView taoTextViDu(
            String viDu) {

        TextView textView =
                new TextView(
                        requireContext()
                );

        textView.setText(
                viDu
        );

        textView.setTextSize(11);

        textView.setTextColor(
                android.graphics.Color.parseColor(
                        "#7C8492"
                )
        );

        textView.setTypeface(
                getResources().getFont(
                        R.font.juve_normal
                )
        );


        LinearLayout.LayoutParams params =
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );

        params.bottomMargin =
                dpToPx(12);

        textView.setLayoutParams(
                params
        );

        return textView;
    }


    /**
     * Phát audio của từ.
     */
    private void phatAm() {

        if (audioUrl == null
                || audioUrl.isEmpty()) {

            Toast.makeText(
                    requireContext(),
                    "Từ này chưa có phát âm",
                    Toast.LENGTH_SHORT
            ).show();

            return;
        }


        /*
         * Giải phóng audio cũ nếu có.
         */
        if (mediaPlayer != null) {

            mediaPlayer.release();

            mediaPlayer = null;
        }


        mediaPlayer =
                new MediaPlayer();


        try {

            mediaPlayer.setDataSource(
                    audioUrl
            );


            /*
             * prepareAsync để không chặn UI.
             */
            mediaPlayer.setOnPreparedListener(
                    MediaPlayer::start
            );


            mediaPlayer.setOnCompletionListener(
                    mp -> {

                        mp.release();

                        mediaPlayer = null;
                    }
            );


            mediaPlayer.prepareAsync();


        } catch (IOException e) {

            Toast.makeText(
                    requireContext(),
                    "Không thể phát âm",
                    Toast.LENGTH_SHORT
            ).show();
        }
    }


    /**
     * Chuyển dp sang pixel.
     */
    private int dpToPx(int dp) {

        return (int) (
                dp
                        * getResources()
                        .getDisplayMetrics()
                        .density
        );
    }


    /**
     * Giải phóng MediaPlayer.
     */
    @Override
    public void onDestroyView() {

        super.onDestroyView();


        if (mediaPlayer != null) {

            mediaPlayer.release();

            mediaPlayer = null;
        }
    }

    private void themVaoLichSu(String tu) {

        SharedPreferences sharedPreferences =
                requireContext().getSharedPreferences(
                        "Kenglish",
                        Context.MODE_PRIVATE
                );

        String token =
                sharedPreferences.getString(
                        "token",
                        null
                );

        if (token == null) {
            return;
        }


        ThemLichSuRequest request =
                new ThemLichSuRequest(tu);


        apiService
                .themLichSuTraTu(
                        "Bearer " + token,
                        request
                )
                .enqueue(new Callback<ApiResponse>() {

                    @Override
                    public void onResponse(
                            @NonNull Call<ApiResponse> call,
                            @NonNull Response<ApiResponse> response) {

                        // Không cần Toast.
                        // Đây là thao tác chạy ngầm.
                    }


                    @Override
                    public void onFailure(
                            @NonNull Call<ApiResponse> call,
                            @NonNull Throwable t) {

                        // Không hiện lỗi vì không ảnh hưởng
                        // chức năng tra từ.
                    }
                });
    }
}