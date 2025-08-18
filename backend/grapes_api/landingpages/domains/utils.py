
import dns.resolver

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
    domain = domain.strip().lower()
    if not domain.startswith("app."):
        domain = f"app.{domain}"

    resolver = dns.resolver.Resolver()
    resolver.nameservers = ['1.1.1.1']

    try:
        response = resolver.resolve(domain, 'CNAME')
        for result in response:
            cname_target = result.to_text().strip('.').lower()
            if 'api.paginaai.com.br' in cname_target:
                return True
    except dns.resolver.NoAnswer:
        pass
    except dns.resolver.NXDOMAIN:
        return None
    except dns.resolver.Timeout:
        pass
    except Exception as e:
        pass

    return False
