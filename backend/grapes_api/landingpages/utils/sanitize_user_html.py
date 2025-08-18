from bs4 import BeautifulSoup, Comment
import bleach
from bleach.css_sanitizer import CSSSanitizer

def sanitize_html(html):
    if not html:
        return ''

    soup = BeautifulSoup(html, 'html.parser')

    # Remove tags perigosas exceto iframe e svg
    for tag_name in ['script', 'style', 'meta', 'title', 'head', 'html']:
        for tag in soup.find_all(tag_name):
            tag.decompose()

    # Remove comentários HTML
    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()

    # Debug: mostrar todos os SVGs antes de remover xmlns
    svgs = soup.find_all('svg')
    print(f'Encontrados {len(svgs)} SVG(s) antes de remover xmlns:')
    for i, svg in enumerate(svgs, 1):
        print(f'--- SVG #{i} ---')
        print(svg.prettify())

    # Remove atributo xmlns da tag svg para evitar problemas
    for svg in svgs:
        if 'xmlns' in svg.attrs:
            print('Removendo xmlns do SVG:')
            print(svg.attrs['xmlns'])
            del svg.attrs['xmlns']

    # Debug: mostrar todos os SVGs depois de remover xmlns
    svgs = soup.find_all('svg')
    print(f'Após remover xmlns, {len(svgs)} SVG(s) restantes:')
    for i, svg in enumerate(svgs, 1):
        print(f'--- SVG #{i} ---')
        print(svg.prettify())

    # Adiciona sandbox nos iframes e filtra origem
    for iframe in soup.find_all('iframe'):
        iframe['sandbox'] = 'allow-scripts allow-same-origin allow-presentation allow-popups'
        src = iframe.get('src', '')
        if not (src.startswith('https://www.youtube.com') or src.startswith('https://player.vimeo.com')):
            iframe.decompose()


    content = soup.body if soup.body else soup
    body_content = ''.join(str(child) for child in content.children)

    allowed_tags = [
        'p', 'div', 'span', 'img', 'a', 'ul', 'ol', 'li', 'strong', 'em',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr', 'section', 'article',
        'header', 'footer', 'nav', 'button', 'iframe',
        'svg', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse', 'g', 'defs', 'use', 'symbol', 'text', 'tspan'
    ]

    allowed_attrs = {
        '*': ['class', 'id', 'style', 'fill', 'stroke', 'stroke-width', 'd', 'viewBox', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'points', 'x1', 'x2', 'y1', 'y2', 'transform'],
        'a': ['href', 'target', 'rel'],
        'img': ['src', 'alt', 'width', 'height'],
        'button': ['type'],
        'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'sandbox'],
        'svg': ['viewBox', 'width', 'height', 'fill', 'stroke'],
        'path': ['d', 'fill', 'stroke'],
        'circle': ['cx', 'cy', 'r', 'fill', 'stroke'],
        'rect': ['x', 'y', 'width', 'height', 'fill', 'stroke'],
        'line': ['x1', 'y1', 'x2', 'y2', 'stroke'],
        'polygon': ['points', 'fill', 'stroke'],
        'polyline': ['points', 'fill', 'stroke'],
        'ellipse': ['cx', 'cy', 'rx', 'ry', 'fill', 'stroke'],
        'text': ['x', 'y', 'fill', 'stroke'],
        'tspan': ['x', 'y', 'dx', 'dy', 'fill', 'stroke'],
    }

    css_sanitizer = CSSSanitizer(
        allowed_css_properties=[
            'color', 'background', 'font-size', 'font-weight', 'text-align',
            'display', 'padding', 'margin', 'width', 'height', 'position', 'top',
            'left', 'right', 'bottom', 'z-index', 'overflow', 'border-radius',
            'backdrop-filter', 'gap', 'grid', 'flex', 'align-items', 'justify-content',
            'fill', 'stroke'
        ],
    )

    cleaned = bleach.clean(
        body_content,
        tags=allowed_tags,
        attributes=allowed_attrs,
        css_sanitizer=css_sanitizer,
        protocols=['http', 'https'],
        strip=True
    )

    return cleaned
