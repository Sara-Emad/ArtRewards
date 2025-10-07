<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Artist;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $artist = Artist::firstOrCreate([
            'email' => 'artist@example.com',
        ], [
            'name' => 'Demo Artist',
            'bio' => 'Mock artist used for seeding collections.',
        ]);

        $this->call([
            ArtworkSeeder::class,
            CollectionSeeder::class,
        ]);
    }
}
