package com.example.kenglish.model;

import java.util.List;

public class LichSuTraTuResponse {

    private boolean success;
    private List<LichSuTraTu> history;

    public boolean isSuccess() {
        return success;
    }

    public List<LichSuTraTu> getHistory() {
        return history;
    }
}