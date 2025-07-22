
def verify_domain(domain: str) -> bool:
    import whois
    """
    Checks if a domain is registered.
    Returns True if it is registered, False otherwise.
    """
    try:
        info = whois.whois(domain) 
        return bool(info.domain_name) 
    except Exception:
        return False 

def verify_cname(domain: str) -> bool:
    import dns.resolver

    domain = domain.strip().lower()

    # Tentar verificar o CNAME no subdomínio www
    if not domain.startswith("www."):
        domain = f"www.{domain}"

    print(f"Verificando CNAME de: {domain}")

    try:
        response = dns.resolver.resolve(domain, 'CNAME')
        for result in response:
            cname_target = result.to_text().strip('.').lower()
            print(f"CNAME encontrado: {cname_target}")
            if 'cname.pageflow.app' in cname_target:
                print("CNAME válido encontrado.")
                return True
        print("CNAME não corresponde ao esperado.")
    except dns.resolver.NoAnswer:
        print("Nenhum CNAME encontrado — talvez seja um domínio raiz?")
    except dns.resolver.NXDOMAIN:
        print("Domínio não existe.")
    except dns.resolver.Timeout:
        print("Timeout na consulta DNS.")
    except Exception as e:
        print(f"Erro desconhecido: {e}")

    return False
