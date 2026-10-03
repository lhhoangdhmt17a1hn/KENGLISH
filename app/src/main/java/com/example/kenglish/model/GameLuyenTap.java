package com.example.kenglish.model;

/**
 * Model lưu thông tin một chế độ luyện tập.
 */
public class GameLuyenTap {

    private String tenGame;
    private String moTa;
    private int icon;
    private int coinThuong;
    private int background;

    public GameLuyenTap(String tenGame,
                        String moTa,
                        int icon,
                        int coinThuong,
                        int background) {

        this.tenGame = tenGame;
        this.moTa = moTa;
        this.icon = icon;
        this.coinThuong = coinThuong;
        this.background = background;
    }

    public String getTenGame() {
        return tenGame;
    }

    public String getMoTa() {
        return moTa;
    }

    public int getIcon() {
        return icon;
    }

    public int getCoinThuong() {
        return coinThuong;
    }

    public int getBackground() {
        return background;
    }
}