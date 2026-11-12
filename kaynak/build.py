"""Armatör derleme betiği.

kaynak/src içindeki dosyaları tek bir oyun dosyasında birleştirir ve
deponun kökündeki index.html dosyasını yeniden yazar.

Kullanım (kaynak klasörünün içinde):  python3 build.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
OUT = os.path.join(HERE, '..', 'index.html')
FILES = ['lang.js', 'data.js', 'game.js', 'corp.js', 'prog.js', 'deep.js', 'deep2.js', 'deep3.js', 'deep4.js', 'map.js', 'art.js', 'ui2.js', 'ui3.js', 'ui4.js', 'ui5.js', 'ui6.js', 'ui7.js', 'audio.js', 'ui.js']
PWA = '''<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Armatör">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'''


def read(name):
    with open(os.path.join(SRC, name), encoding='utf8') as f:
        return f.read()


def main():
    js = ''.join(read(f) + '\n' for f in FILES)
    html = read('shell.html').replace('<!--__PWA__-->', PWA).replace('/*__CSS__*/', read('layout.css')).replace('/*__JS__*/', js)
    with open(OUT, 'w', encoding='utf8') as f:
        f.write(html)
    print('index.html yazıldı:', len(html), 'bayt')


if __name__ == '__main__':
    main()
