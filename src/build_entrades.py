"""Genera entrades.html a partir de index.html: mateixa capçalera, menú, peu,
cookies i analítica, amb la taquilla (src/entrades.css + src/entrades.js) al mig.
Ús: python3 src/build_entrades.py  (des de l'arrel del repo)"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
home = (root / 'index.html').read_text()
css = (root / 'src/entrades.css').read_text()
js = (root / 'src/entrades.js').read_text()

def between(s, a, b, start=0):
    i = s.index(a, start); j = s.index(b, i) + len(b); return s[i:j]

# Enllaços interns de la home -> que apuntin a la home des d'aquesta pàgina
def relink(html):
    html = re.sub(r'href="#(calendari|olimpic|socis)"', r'href="index.html#\1"', html)
    return html

head = home[:home.index('</head>')]
head = re.sub(r'<title>.*?</title>', '<title>Entrades · Penya · Concepte de web (proposta Boira.studio)</title>', head, flags=re.S)
head = re.sub(r'<meta name="description" content="[^"]*">',
              '<meta name="description" content="Concepte de taquilla no oficial per al Club Joventut Badalona: tria sector i seient a l\'Olímpic, packs i abonaments. Pagament simulat.">', head)
head = head.replace('<link rel="canonical" href="https://penya.boira.studio/">', '<link rel="canonical" href="https://penya.boira.studio/entrades.html">')
head += '<style>\n' + css + '\n</style>\n</head>\n'

body_start = home.index('<body>')
menu_end = home.index('</div>', home.index('<div id="menu"')) # primer </div> intern
# el menú acaba al </div> que tanca #menu: el busquem com el bloc fins a la línia "</div>" sola després de menu-foot
menu_block_end = home.index('\n</div>\n', home.index('class="menu-foot"')) + len('\n</div>\n')
chrome = home[body_start:menu_block_end]
chrome = chrome.replace('<header id="site-header" style="position: absolute; left: 0; right: 0; top: 34px; z-index: 5">',
                        '<header id="site-header" style="position: relative; z-index: 5">')
chrome = chrome.replace('<a href="#calendari" class="m-btn m-solid">Entrades</a>', '<a href="entrades.html" class="m-btn m-solid">Entrades</a>')
chrome = relink(chrome)
assert 'position: relative; z-index: 5' in chrome

page = '''
<div class="wrap pagehead">
<span class="kicker">Palau Olímpic de Badalona · Temporada 2026/27</span>
<h1>Entrades</h1>
<p class="lead">Tria el partit, el sector i el teu seient. O fes-te soci i guarda'l tota la temporada.</p>
</div>
<nav id="sub" aria-label="Entrades i abonaments"><div class="wrap" id="subin"></div></nav>
<main class="wrap" id="app"></main>
'''
footer = relink(between(home, '<footer', '</footer>'))
footer = footer.replace('utm_content=footer', 'utm_content=entrades-footer')
close_wrapper = '\n</div>\n<div id="bar"></div>\n'

menu_js = between(home, "<script>\n(function(){\n  var b=document.getElementById('burger')", '</script>')
# a la home la capçalera és absoluta sobre el hero; aquí és relativa: en tancar el menú, tornar a l'estil original
menu_js = menu_js.replace("var h=document.getElementById('site-header'), t0=h.style.top, unpin=null;",
                          "var h=document.getElementById('site-header'), t0=h.style.top, p0=h.style.position, unpin=null;")
menu_js = menu_js.replace("h.style.position='absolute';h.style.top=t0;", "h.style.position=p0;h.style.top=t0;")
assert 'p0=h.style.position' in menu_js

cookies = home[home.index('<div id="ck"'):home.index('</body>')]

out = head + chrome + page + footer + close_wrapper + '<script>\n' + js + '\n</script>\n' + menu_js + '\n' + cookies + '</body>\n</html>\n'
(root / 'entrades.html').write_text(out)
print('entrades.html', len(out), 'bytes')
