import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/shipments_provider.dart';

class CreateShipmentPage extends StatefulWidget {
  final VoidCallback? onGoToDashboard;
  const CreateShipmentPage({super.key, this.onGoToDashboard});

  @override
  State<CreateShipmentPage> createState() => _CreateShipmentPageState();
}

class _CreateShipmentPageState extends State<CreateShipmentPage> {
  final _formKey = GlobalKey<FormState>();
  final _recipientNameController = TextEditingController();
  final _recipientEmailController = TextEditingController();
  final _originController = TextEditingController(text: 'London, UK');
  final _destinationController = TextEditingController();

  String _selectedGift = 'Premium Roses Bouquet';
  String _selectedCourier = 'DHL';
  bool _insured = true;

  // Form result states
  bool _isSuccess = false;
  String _generatedPin = '';

  final Map<String, double> _giftPrices = {
    'Premium Roses Bouquet': 45.0,
    'Belgian Chocolate Box': 32.0,
    'Smart Watch Pro': 199.0,
    'Designer Perfume': 89.0,
    'Luxury Gift Card': 50.0,
    'Personalized Photo Frame': 28.0,
  };

  final Map<String, double> _courierRates = {
    'DHL': 24.0,
    'FedEx': 21.0,
    'UPS': 19.0,
    'EMS': 14.0,
  };

  final double _insuranceFee = 5.0;

  @override
  void dispose() {
    _recipientNameController.dispose();
    _recipientEmailController.dispose();
    _originController.dispose();
    _destinationController.dispose();
    super.dispose();
  }

  void _reviewOrder() {
    if (!_formKey.currentState!.validate()) return;

    final giftPrice = _giftPrices[_selectedGift] ?? 0.0;
    final shippingFee = _courierRates[_selectedCourier] ?? 0.0;
    final total = giftPrice + shippingFee + (_insured ? _insuranceFee : 0.0);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Confirm Payment',
                        style: GoogleFonts.outfit(
                          textStyle: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  
                  // Summary Box
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF9FAFB),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.black12.withOpacity(0.05)),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        _buildSummaryRow('Gift Item', _selectedGift),
                        const Divider(height: 16),
                        _buildSummaryRow('Gift Price', '\$${giftPrice.toStringAsFixed(2)}'),
                        const Divider(height: 16),
                        _buildSummaryRow('Shipping ($_selectedCourier)', '\$${shippingFee.toStringAsFixed(2)}'),
                        if (_insured) ...[
                          const Divider(height: 16),
                          _buildSummaryRow('Gifting Protection 🛡️', '\$${_insuranceFee.toStringAsFixed(2)}'),
                        ],
                        const Divider(height: 24, thickness: 1.5),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Total',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            Text(
                              '\$${total.toStringAsFixed(2)}',
                              style: GoogleFonts.outfit(
                                textStyle: const TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 18,
                                  color: Color(0xFFEC4899),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Submit
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context); // Close bottom sheet
                      _submitOrder();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEC4899),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      '💳 Pay \$${total.toStringAsFixed(2)} & Send',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _submitOrder() async {
    final provider = Provider.of<ShipmentsProvider>(context, listen: false);
    
    final giftPrice = _giftPrices[_selectedGift] ?? 0.0;
    // Calculate a delivery ETA: 4 days from now
    final etaDate = DateTime.now().add(const Duration(days: 4));
    final etaString = "${etaDate.year}-${etaDate.month.toString().padLeft(2, '0')}-${etaDate.day.toString().padLeft(2, '0')}";

    final result = await provider.addShipment(
      recipient: _recipientNameController.text.trim(),
      origin: _originController.text.trim(),
      destination: _destinationController.text.trim(),
      courier: _selectedCourier,
      eta: etaString,
      value: giftPrice,
      insured: _insured,
      item: _selectedGift,
    );

    if (result != null) {
      setState(() {
        _isSuccess = true;
        _generatedPin = result['pin'] ?? 'GP-XXXX-XXXX';
      });
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.errorMessage ?? 'Failed to send gift'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  Widget _buildSummaryRow(String title, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 12, color: Colors.black54),
        ),
        Text(
          value,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isSuccess) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Success Badge
                Container(
                  width: 72,
                  height: 72,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF0FDF4),
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Text(
                      '✓',
                      style: TextStyle(
                        color: Colors.green,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Payment Confirmed! 🎉',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    textStyle: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Colors.black87,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Your gift shipment is registered and awaiting processing.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.black45, fontSize: 13),
                ),
                const SizedBox(height: 32),
                
                // PIN Display Box
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFDF2F8), Color(0xFFEEF2FF)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFFCE7F3), width: 2),
                  ),
                  child: Column(
                    children: [
                      const Text(
                        'YOUR GIFT TRACKING PIN',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.black45,
                          letterSpacing: 1,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _generatedPin,
                        style: GoogleFonts.outfit(
                          textStyle: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFFEC4899),
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 48),
                
                ElevatedButton(
                  onPressed: () {
                    if (widget.onGoToDashboard != null) {
                      widget.onGoToDashboard!();
                    } else {
                      Navigator.pop(context);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEC4899),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Text(
                    'Go to Dashboard',
                    style: GoogleFonts.outfit(
                      textStyle: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black87,
        title: Text(
          'Send a Surprising Gift',
          style: GoogleFonts.outfit(
            textStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Register Gift Shipment',
                style: GoogleFonts.outfit(
                  textStyle: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Fill in the recipient and item details below. We generate a unique Gift PIN and link with shipping carriers.',
                style: TextStyle(fontSize: 12, color: Colors.black45),
              ),
              const SizedBox(height: 24),
              
              // Recipient Name
              TextFormField(
                controller: _recipientNameController,
                decoration: InputDecoration(
                  labelText: 'Recipient Name *',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Recipient Name is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Recipient Email
              TextFormField(
                controller: _recipientEmailController,
                decoration: InputDecoration(
                  labelText: 'Recipient Email *',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Recipient Email is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Origin Location
              TextFormField(
                controller: _originController,
                decoration: InputDecoration(
                  labelText: 'Origin Location *',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Origin is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Destination Location
              TextFormField(
                controller: _destinationController,
                decoration: InputDecoration(
                  labelText: 'Destination Country *',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Destination is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Dropdown Gift Item
              DropdownButtonFormField<String>(
                value: _selectedGift,
                items: _giftPrices.keys.map((gift) {
                  return DropdownMenuItem(
                    value: gift,
                    child: Text('$gift (\$${_giftPrices[gift]!.toStringAsFixed(0)})'),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedGift = val);
                },
                decoration: InputDecoration(
                  labelText: 'Surprise Gift Item',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Dropdown Courier
              DropdownButtonFormField<String>(
                value: _selectedCourier,
                items: _courierRates.keys.map((courier) {
                  return DropdownMenuItem(
                    value: courier,
                    child: Text('$courier Courier (\$${_courierRates[courier]!.toStringAsFixed(0)})'),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCourier = val);
                },
                decoration: InputDecoration(
                  labelText: 'Courier Partner',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Insurance Switch
              SwitchListTile(
                title: const Text(
                  'Gifting Protection 🛡️',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                subtitle: const Text(
                  'Full value coverage + priority notification status (+\$5.00)',
                  style: TextStyle(fontSize: 11, color: Colors.black38),
                ),
                value: _insured,
                activeColor: const Color(0xFFEC4899),
                onChanged: (val) => setState(() => _insured = val),
              ),
              const SizedBox(height: 32),

              ElevatedButton(
                onPressed: _reviewOrder,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEC4899),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 4,
                  shadowColor: const Color(0xFFEC4899).withOpacity(0.4),
                ),
                child: Text(
                  'Review Shipment Details',
                  style: GoogleFonts.outfit(
                    textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
