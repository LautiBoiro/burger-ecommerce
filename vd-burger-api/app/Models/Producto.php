<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'nombre',
        'categoria',
        'descripcion',
        'precio',
        'disponible',
        'incluye_papas',
    ];
}