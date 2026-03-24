import React, { useState, useEffect } from 'react';

interface Song {
    name: string;
    url: string;
}

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('crisisTools');
    const [savedSongs, setSavedSongs] = useState<Song[]>([]);

    useEffect(() => {
        const storedSongs = JSON.parse(localStorage.getItem('savedSongs') || '[]') as Song[];
        setSavedSongs(storedSongs);
    }, []);

    const handleSaveSong = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            if (e.target && e.target.result) {
                const songData: Song = {
                    name: file.name,
                    url: e.target.result as string,
                };
                const updatedSongs = [...savedSongs, songData];
                setSavedSongs(updatedSongs);
                localStorage.setItem('savedSongs', JSON.stringify(updatedSongs));
                alert('Song saved successfully!');
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <div>
            <nav>
                <button onClick={() => setActiveTab('crisisTools')}>Crisis Tools</button>
                <button onClick={() => setActiveTab('supportiveSongs')}>Supportive Songs</button>
            </nav>

            {activeTab === 'crisisTools' && (
                <div className="crisis-tools">
                    {/* Existing Crisis Tools content */}
                </div>
            )}

            {activeTab === 'supportiveSongs' && (
                <div className="music-player">
                    <h3>Supportive Songs</h3>
                    <audio id="musicPlayer" controls style={{ width: '100%', maxWidth: '300px' }}>
                        <source id="currentSong" src="" type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <input
                        type="file"
                        id="songInput"
                        accept="audio/*"
                        style={{ marginTop: '10px' }}
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                                handleSaveSong(files[0]);
                            }
                        }}
                    />
                    <ul id="savedSongsList" style={{ marginTop: '10px', listStyleType: 'none', padding: 0 }}>
                        {savedSongs.map((song, index) => (
                            <li
                                key={index}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const musicPlayer = document.getElementById('musicPlayer') as HTMLAudioElement;
                                    const currentSong = document.getElementById('currentSong') as HTMLSourceElement;
                                    if (musicPlayer && currentSong) {
                                        currentSong.src = song.url;
                                        musicPlayer.load();
                                        musicPlayer.play();
                                    }
                                }}
                            >
                                {song.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;