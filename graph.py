import networkx as nx
import matplotlib.pyplot as plt
import streamlit as st

def generate_attack_graph(attack_type):
    """
    Generates a NetworkX graph for the given attack type.
    Flow: Source -> Vulnerability -> Attack Type -> Impact
    """
    G = nx.DiGraph()
    
    # Define Nodes based on Attack Type
    nodes = {
        'Phishing': {
            'src': 'Attacker (Email)',
            'vuln': 'Human Element',
            'impact': 'Credential Theft'
        },
        'Malware': {
            'src': 'C2 Server',
            'vuln': 'Unpatched Software',
            'impact': 'System Compromise'
        },
        'DDoS': {
            'src': 'Botnet',
            'vuln': 'Network Bandwidth',
            'impact': 'Service Unavailable'
        },
        'Ransomware': {
            'src': 'Malicious Payload',
            'vuln': 'RDP / Phishing',
            'impact': 'Data Encryption'
        },
        'SQL Injection': {
            'src': 'Web Client',
            'vuln': 'Input Fields',
            'impact': 'Database Leak'
        }
    }
    
    # Default if not found
    data = nodes.get(attack_type, {
        'src': 'Unknown Source', 
        'vuln': 'System Vulnerability', 
        'impact': 'Security Breach'
    })
    
    # Add Nodes
    G.add_node(data['src'], color='#ff0055', layer=0)
    G.add_node(data['vuln'], color='#ffcc00', layer=1)
    G.add_node(attack_type, color='#00f2ff', layer=2)
    G.add_node(data['impact'], color='#00ff9d', layer=3)
    
    # Add Edges
    G.add_edge(data['src'], data['vuln'], label='Exploits')
    G.add_edge(data['vuln'], attack_type, label='Facilitates')
    G.add_edge(attack_type, data['impact'], label='Causes')
    
    return G

def plot_graph(G):
    pos = nx.spring_layout(G, seed=42)
    
    # Colors
    color_map = [G.nodes[node].get('color', 'skyblue') for node in G.nodes]
    
    fig, ax = plt.subplots(figsize=(8, 4))
    fig.patch.set_facecolor('#00000000') # Transparent background
    ax.set_facecolor('#00000000')
    
    nx.draw(G, pos, ax=ax, with_labels=True, node_color=color_map, 
            node_size=3000, font_size=10, font_weight='bold', 
            arrows=True, edge_color='white', font_color='black')
            
    # Draw Edge Labels
    edge_labels = nx.get_edge_attributes(G, 'label')
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_color='red')
    
    st.pyplot(fig)
