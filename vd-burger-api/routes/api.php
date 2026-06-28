<?php

use App\Models\Producto;
use Illuminate\Support\Facades\Route;

Route::get('/productos', function () {
    return Producto::where('disponible', true)->get();
});