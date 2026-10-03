package com.example.kenglish;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

/**
 * Fragment hiển thị màn hình Cửa hàng.
 *
 * Chức năng Cửa hàng hiện đang trong quá trình phát triển.
 */
public class CuaHang extends Fragment {

    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {

        return inflater.inflate(
                R.layout.cua_hang,
                container,
                false
        );
    }
}