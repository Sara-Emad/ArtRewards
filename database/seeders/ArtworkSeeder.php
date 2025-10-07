<?php

namespace Database\Seeders;

use App\Models\Artwork;
use Illuminate\Database\Seeder;

class ArtworkSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'title' => 'Rare Bird VI',
                'artist_name' => 'Mark Hellbusch',
                'category' => 'Painting',
                'price_cents' => 69000,
                'image_url' => 'https://picsum.photos/300/400?random=1',
                'link' => '/artwork/1',
            ],
            [
                'title' => 'Mountain Dreams',
                'artist_name' => 'Sarah Johnson',
                'category' => 'Photography',
                'price_cents' => 85000,
                'image_url' => 'https://picsum.photos/300/400?random=2',
                'link' => '/artwork/2',
            ],
            [
                'title' => 'Ocean Waves',
                'artist_name' => 'Michael Chen',
                'category' => 'Digital Art',
                'price_cents' => 72000,
                'image_url' => 'https://picsum.photos/300/400?random=3',
                'link' => '/artwork/3',
            ],
            [
                'title' => 'Urban Life',
                'artist_name' => 'Emma Davis',
                'category' => 'Mixed Media',
                'price_cents' => 95000,
                'image_url' => 'https://picsum.photos/300/400?random=4',
                'link' => '/artwork/4',
            ],
            [
                'title' => 'Desert Soul',
                'artist_name' => 'Alex Rodriguez',
                'category' => 'Sculpture',
                'price_cents' => 68000,
                'image_url' => 'https://picsum.photos/300/400?random=5',
                'link' => '/artwork/5',
            ],
            [
                'title' => 'Forest Magic',
                'artist_name' => 'Lisa Wang',
                'category' => 'Painting',
                'price_cents' => 89000,
                'image_url' => 'https://picsum.photos/300/400?random=6',
                'link' => '/artwork/6',
            ],
            [
                'title' => 'Sunset Glow',
                'artist_name' => 'David Kim',
                'category' => 'Photography',
                'price_cents' => 78000,
                'image_url' => 'httpsum.photos/300/400?random=7',
                'link' => '/artwork/7',
            ],
            [
                'title' => 'Winter Mist',
                'artist_name' => 'Maria Garcia',
                'category' => 'Digital Art',
                'price_cents' => 92000,
                'image_url' => 'https://picsum.photos/300/400?random=8',
                'link' => '/artwork/8',
            ],
        ];

        foreach ($data as $row) {
            Artwork::updateOrCreate(
                ['title' => $row['title']],
                $row
            );
        }
    }
}


