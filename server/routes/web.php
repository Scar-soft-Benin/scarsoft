<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});



// Documentation API simple et fonctionnelle
Route::get('/api/documentation', function () {
    return response()->view('api-documentation');
});