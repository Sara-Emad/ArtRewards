<?php

namespace Database\Seeders;

use App\Models\Artist;
use App\Models\Artwork;
use App\Models\Collection;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    public function run(): void
    {
        $artist = Artist::first();
        if (!$artist) {
            $artist = Artist::create([
                'name' => 'Demo Artist',
                'email' => 'artist@example.com',
                'bio' => 'Mock artist used for seeding collections.',
            ]);
        }

        $collectionsData = [
            [
                'title' => 'Nature Wonders',
                'description' => 'A curated set of calming nature artworks.',
                'cover_image_url' => 'https://picsum.photos/seed/collection1/600/400',
            ],
            [
                'title' => 'Urban Stories',
                'description' => 'City life captured in various mediums.',
                'cover_image_url' => 'https://picsum.photos/seed/collection2/600/400',
            ],
            [
                'title' => 'Abstract Dreams',
                'description' => 'Bold colors and abstract shapes.',
                'cover_image_url' => 'https://picsum.photos/seed/collection3/600/400',
            ],
        ];

        foreach ($collectionsData as $data) {
            $collection = Collection::updateOrCreate(
                [
                    'artist_id' => $artist->id,
                    'title' => $data['title'],
                ],
                [
                    'description' => $data['description'],
                    'cover_image_url' => $data['cover_image_url'],
                ]
            );

            // Attach 2-5 random artworks if available
            $artworkIds = Artwork::inRandomOrder()->limit(random_int(2, 5))->pluck('id')->all();
            if (!empty($artworkIds)) {
                $collection->artworks()->syncWithoutDetaching($artworkIds);
            }
        }
    }
}


