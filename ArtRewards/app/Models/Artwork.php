<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Artwork extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'artist_name',
        'category',
        'price_cents',
        'image_url',
        'link',
    ];

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class)->withTimestamps();
    }
}


