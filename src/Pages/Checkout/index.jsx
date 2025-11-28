import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../../components/header/index.jsx';
import Footer from '../../components/footer/index.jsx';
import './index.css';
import { getCheckoutItems, clearCheckoutItems, getCart, clearCart, formatBRL } from '../../utils/cart.js';

// Pessoal esse é o primero estado Inicial do Formulário
const INITIAL_FORM_STATE = {
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'brasil',
    address: '',
    city: '',
    district: 'osasco',
    cep: '',
    contact: '',
    email: '',
    additionalInfo: ''
};

// aqui é o componente de Renderização Auxiliar para Campos do Formulário
const FormInput = ({ id, label, value, onChange, error, ...props }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input 
            type="text" 
            id={id} 
            value={value} 
            onChange={onChange} 
            className={error ? 'input-error' : ''} 
            aria-invalid={!!error}
            {...props} 
        />
        {error && <div className="error-msg">{error}</div>}
    </div>
);

//3 Componente Principal da página de Checkout
const CheckoutPage = () => {
    const [items, setItems] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    //Lógica de Redirecionamento 
    useEffect(() => {
        const list = getCheckoutItems();
        if (list && list.length > 0) {
            setItems(list);
            return;
        }
        const cart = getCart();
        if (!cart || cart.length === 0) {
            toast.error('Seu carrinho está vazio. Adicione itens para continuar.');
            // pelo que pesquisei, usar navigate dentro do useEffect é seguro
            navigate('/carrinho', { replace: true });
        }
        setItems(cart);
    }, [navigate]);

    //  Cálculo usando useMemo para otimização p evitar recaulos desnecessário
    const subtotal = useMemo(() => items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0), [items]);

    //Handlers e Validadores 

    const handleChange = useCallback((e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
        // Remove o erro assim que o usuário digita
        if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
    }, [errors]);

    const validate = useCallback(() => {
        const err = {};
        const req = ['firstName', 'lastName', 'address', 'city', 'cep', 'contact', 'email'];
        req.forEach((k) => {
            if (!form[k] || String(form[k]).trim() === '') err[k] = 'Campo obrigatório';
        });

        if (!form.country) err.country = 'Selecione o país';
        if (!form.district) err.district = 'Selecione o bairro';
        if (form.email && !/.+@.+\..+/.test(form.email)) err.email = 'E-mail inválido';

        const cepDigits = (form.cep || '').replace(/\D/g, '');
        if (cepDigits.length !== 8) err.cep = 'CEP deve ter 8 dígitos';
        
        const contactDigits = (form.contact || '').replace(/\D/g, '');
        if (contactDigits.length < 10) err.contact = 'Contato inválido';

        setErrors(err);
        return Object.keys(err).length === 0;
    }, [form]);

    const placeOrder = useCallback(() => {
        if (!validate()) {
            toast.error('Preencha todos os campos obrigatórios corretamente.');
            return;
        }
        // Lógica de finalização
        clearCart();
        clearCheckoutItems();
        setOrderPlaced(true);
        toast.success('Compra finalizada! Obrigado pela compra.');
    }, [validate]);

    const closeModal = () => setOrderPlaced(false);
    
    // Essas são as Funções Auxiliares de Renderização (Para Limpar o Return) 

    // Renderiza a seção do formulário de endereço e contato
    const renderBillingDetails = () => (
        <form className="billing-details-form" onSubmit={(e) => { e.preventDefault(); placeOrder(); }}>
            
            {/* Dados Pessoais */}
            <section className="checkout-section">
                <h2>Dados pessoais</h2>
                <div className="form-row">
                    <FormInput id="firstName" label="Primeiro nome" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
                    <FormInput id="lastName" label="Último nome" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
                </div>
                <FormInput id="companyName" label="Nome da Empresa (opcional)" value={form.companyName} onChange={handleChange} />
            </section>

            {/* Endereço */}
            <section className="checkout-section">
                <h2>Endereço</h2>
                {/* País/Região (Select) */}
                <div className="form-group">
                    <label htmlFor="country">País / Região</label>
                    <select id="country" value={form.country} onChange={handleChange} required className={errors.country ? 'input-error' : ''} aria-invalid={!!errors.country}>
                        <option value="brasil">Brasil</option>
                    </select>
                    {errors.country && <div className="error-msg">{errors.country}</div>}
                </div>
                
                <FormInput id="address" label="Endereço" value={form.address} onChange={handleChange} error={errors.address} required />
                
                <div className="form-row">
                    <FormInput id="city" label="Cidade" value={form.city} onChange={handleChange} error={errors.city} required />
                    {/* Bairro/Região (Select) */}
                    <div className="form-group">
                        <label htmlFor="district">Bairro / Região (Grande São Paulo)</label>
                        <select id="district" value={form.district} onChange={handleChange} required className={errors.district ? 'input-error' : ''} aria-invalid={!!errors.district}>
                            {['Osasco', 'São Paulo - Zona Norte', 'São Paulo - Zona Sul', 'São Paulo - Zona Leste', 'São Paulo - Zona Oeste', 'Santo André', 'São Bernardo do Campo', 'São Caetano do Sul', 'Diadema', 'Guarulhos', 'Barueri', 'Carapicuíba', 'Taboão da Serra', 'Embu das Artes', 'Itapecerica da Serra']
                                .map(d => (
                                    <option key={d} value={d.toLowerCase().replace(/ /g, '-')}>
                                        {d}
                                    </option>
                                ))}
                        </select>
                        {errors.district && <div className="error-msg">{errors.district}</div>}
                    </div>
                </div>

                <FormInput id="cep" label="CEP" value={form.cep} onChange={handleChange} error={errors.cep} required placeholder="00000-000" />
            </section>

            {/* Contato e Email */}
            <section className="checkout-section">
                <h2>Contato</h2>
                <div className="form-row">
                    <FormInput id="contact" label="Contato" value={form.contact} onChange={handleChange} error={errors.contact} required placeholder="(11) 90000-0000" />
                    <FormInput id="email" label="Endereço e-mail" value={form.email} onChange={handleChange} error={errors.email} required type="email" />
                </div>
            </section>

            {/* Informações adicionais */}
            <section className="checkout-section">
                <h2>Informações adicionais</h2>
                <div className="form-group">
                    <label htmlFor="additionalInfo">Informações adicionais</label>
                    <textarea id="additionalInfo" rows="4" value={form.additionalInfo} onChange={handleChange}></textarea>
                </div>
            </section>
        </form>
    );

    // Renderiza o resumo do pedido (lado direito)
    const renderOrderSummary = () => (
        <div className="order-summary">
            <div className="summary-box">
                <div className="summary-header">
                    <span>Produto</span>
                    <span>Subtotal</span>
                </div>
                
                {/* Lista de Itens */}
                {items && items.length > 0 ? (
                    items.map((it) => (
                        <div key={`${it.type}-${it.id}`} className="summary-item">
                            <span>{it.title} × {it.quantity || 1}</span>
                            <span>{formatBRL((it.price || 0) * (it.quantity || 1))}</span>
                        </div>
                    ))
                ) : (
                    <div className="summary-item">
                        <span>Nenhum item no checkout</span>
                        <span>{formatBRL(0)}</span>
                    </div>
                )}
                
                {/* Totais */}
                <div className="summary-subtotal">
                    <span>Subtotal</span>
                    <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="summary-total">
                    <span>Total</span>
                    <span>{formatBRL(subtotal)}</span>
                </div>
            </div>

            {/* Métodos de Pagamento */}
            <div className="payment-methods">
                <div className="payment-option">
                    <input type="radio" id="bankTransfer" name="paymentMethod" defaultChecked />
                    <label htmlFor="bankTransfer">Pagamento via Transferência Bancária</label>
                    <div className="payment-description">
                        Faça seu pagamento diretamente em nossa conta bancária. Por favor, utilize o ID do seu pedido como referência no pagamento. Seu pedido não será enviado até o pagamento ser compensado.
                    </div>
                </div>
                <div className="payment-option">
                    <input type="radio" id="creditCard" name="paymentMethod" />
                    <label htmlFor="creditCard">Cartão de Crédito/Débito</label>
                </div>
                <div className="payment-option">
                    <input type="radio" id="onDelivery" name="paymentMethod" />
                    <label htmlFor="onDelivery">Pagamento na entrega</label>
                </div>
            </div>
            
            <p className="privacy-note">
                Seus dados pessoais serão utilizados para... <a href="#">Política de Privacidade</a>.
            </p>
            
            <button type="button" onClick={placeOrder} className="place-order-btn" disabled={subtotal === 0}>
                Efetuar Compra
            </button>
        </div>
    );

    // Renderização Principal 
        
            return (
        <div className="checkout-page">
            <Header />
            <main className="checkout-container">
                <h1>Finalizar Pagamento</h1>
                <div className="checkout-layout">
                    
                    {/* Lado Esquerdo: Detalhes da Cobrança */}
                    {renderBillingDetails()}
                    
                    {/* Lado Direito: Resumo e Pagamento */}
                    {renderOrderSummary()}

                </div>
            </main>
            
            {/* Modal de Confirmação */}
            {orderPlaced && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
                        <h3>Compra finalizada!</h3>
                        <p>Obrigado pela compra. Você receberá atualizações por e-mail.</p>
                        <button className="modal-btn" onClick={closeModal}>Fechar</button>
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
};

export default CheckoutPage;