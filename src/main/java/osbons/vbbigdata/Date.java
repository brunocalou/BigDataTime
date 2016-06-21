/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package osbons.vbbigdata;

/**
 *
 * @author Jean-Loïc Mugnier <mugnier at polytech.unice.fr>
 */
public class Date {

    private int year;
    private int month;
    private int day;

    Date(int year, int month, int day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public static Date getDate(String date) {
        String[] strs = date.split("-");
        Date d = new Date(Integer.valueOf(strs[0]), Integer.valueOf(strs[1]), Integer.valueOf(strs[2]));
        return d;
    }

    public int compareTo(Date other) {
        int ret = 0;
        if (this.year < other.getYear()) {
            ret = -1;
        } else {
            if (this.year > other.getYear()) {
                ret = -1;
            } else {
                if (this.month < other.getMonth()) {
                    ret = -1;
                } else {
                    if (this.month > other.getMonth()) {
                        ret = 1;
                    } else {
                        if (this.day < other.getDay()) {
                            ret = -1;
                        } else {
                            if (this.day > other.getDay()) {
                                ret = 1;
                            } else {
                                ret = 0;
                            }
                        }
                    }
                }
            }

        }
        return ret;
    }

    public int getYear() {
        return this.year;
    }

    public int getMonth() {
        return this.month;
    }

    public int getDay() {
        return this.day;
    }
}
