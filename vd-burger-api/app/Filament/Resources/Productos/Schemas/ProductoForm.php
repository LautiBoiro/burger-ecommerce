<?php

namespace App\Filament\Resources\Productos\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nombre')
                    ->required()
                    ->maxLength(255),

                Select::make('categoria')
                    ->required()
                    ->options([
                        'burger' => 'Hamburguesa',
                        'extra' => 'Extra',
                    ]),

                Textarea::make('descripcion')
                    ->nullable()
                    ->rows(3),

                TextInput::make('precio')
                    ->required()
                    ->numeric()
                    ->prefix('$'),

                Toggle::make('disponible')
                    ->default(true),

                Toggle::make('incluye_papas')
                    ->default(false),
            ]);
    }
}